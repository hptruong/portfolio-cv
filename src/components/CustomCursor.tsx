"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapSetup";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  // rerender-use-ref-transient-values: useRef instead of useState to avoid re-render
  const isTouchRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    isTouchRef.current = isTouch;

    if (isTouch) {
      // Hide cursor elements on touch devices
      if (cursorRef.current) cursorRef.current.style.display = "none";
      if (followerRef.current) followerRef.current.style.display = "none";
      return;
    }

    mountedRef.current = true;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // rerender-use-ref-transient-values: mousemove updates DOM directly via GSAP, no state
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    // js-set-map-lookups: Use Set for O(1) lookups instead of array includes
    const TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "LI"]);

    const isTextElement = (el: HTMLElement): boolean => {
      return (
        TEXT_TAGS.has(el.tagName) ||
        el.classList.contains("hover-text") ||
        el.closest(".hover-text") !== null
      );
    };

    const isInteractive = (el: HTMLElement): boolean => {
      return (
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        el.closest("a") !== null ||
        el.closest("button") !== null
      );
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (isInteractive(target)) {
        gsap.to(follower, {
          width: 60,
          height: 60,
          opacity: 0.4,
          duration: 0.4,
          ease: "expo.out",
        });
        gsap.to(cursor, { scale: 0.5, duration: 0.3, ease: "power3.out" });
      } else if (isTextElement(target)) {
        gsap.to(follower, {
          width: 80,
          height: 80,
          opacity: 1,
          duration: 0.5,
          ease: "expo.out",
        });
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
      }
    };

    const handleMouseOut = () => {
      gsap.to(follower, {
        width: 28,
        height: 28,
        opacity: 0.5,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" });
    };

    // client-passive-event-listeners: mousemove is read-only, passive is fine
    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // rendering-conditional-render: always render, hide via CSS on touch — avoids conditional mount/unmount
  return (
    <>
      {/* Small dot cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: "var(--accent)" }}
      />
      {/* Follower - uses mix-blend-mode for text color filter */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-50"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "var(--accent)",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
