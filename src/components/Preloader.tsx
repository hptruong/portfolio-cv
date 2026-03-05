"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapSetup";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Curtain split reveal
        const curtainTl = gsap.timeline({
          onComplete: () => setIsLoading(false),
        });

        // Fade out counter + line first
        curtainTl.to([counterRef.current, lineRef.current, nameRef.current], {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
        });

        // Split curtains
        curtainTl.to(topCurtainRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        }, "-=0.1");

        curtainTl.to(bottomCurtainRef.current, {
          yPercent: 100,
          duration: 1,
          ease: "power4.inOut",
        }, "<");
      },
    });

    // Name appears first
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll(".preloader-char");
      tl.fromTo(
        chars,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: "power3.out" },
        0
      );
    }

    // Counter animation with glow pulse
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          const val = Math.round(counter.value);
          counterRef.current.textContent = val + "%";
          // Pulse glow at milestones
          if (val % 25 === 0 && val > 0) {
            gsap.fromTo(counterRef.current,
              { textShadow: "0 0 20px var(--accent)" },
              { textShadow: "0 0 0px var(--accent)", duration: 0.5 }
            );
          }
        }
      },
    }, 0.3);

    // Progress line
    tl.to(lineRef.current, { width: "100%", duration: 2, ease: "power2.inOut" }, 0.3);

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[999]">
      {/* Top curtain */}
      <div
        ref={topCurtainRef}
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ backgroundColor: "var(--bg-deep)" }}
      />
      {/* Bottom curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ backgroundColor: "var(--bg-deep)" }}
      />

      {/* Content centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Name text */}
        <div ref={nameRef} className="mb-6 overflow-hidden">
          {"JULIAN TRUONG".split("").map((char, i) => (
            <span
              key={i}
              className="preloader-char inline-block text-xs sm:text-sm tracking-[0.5em] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {char === " " ? "\u00A0\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Counter */}
        <span
          ref={counterRef}
          className="text-6xl sm:text-7xl md:text-8xl font-bold font-mono"
          style={{ color: "var(--text-primary)" }}
        >
          0%
        </span>

        {/* Progress line */}
        <div className="w-48 sm:w-64 h-px mt-6 relative overflow-hidden" style={{ backgroundColor: "var(--divider)" }}>
          <div
            ref={lineRef}
            className="absolute left-0 top-0 h-full w-0"
            style={{
              background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
              boxShadow: "0 0 10px var(--accent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
