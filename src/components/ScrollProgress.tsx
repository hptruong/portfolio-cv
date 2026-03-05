"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    // Animate width from 0% to 100% based on scroll position
    gsap.to(bar, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === document.documentElement) t.kill();
      });
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100]">
      <div
        ref={progressRef}
        className="h-full w-0"
        style={{
          background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
          boxShadow: "0 0 10px var(--accent)",
        }}
      />
    </div>
  );
}
