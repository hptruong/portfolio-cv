"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

export default function Collaboration() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const marqueeText = "Frontend Development · Motion Graphics · UI/UX Design · Open Source · ";
  const repeatedText = marqueeText.repeat(4);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Collaboration heading */}
      <div className="px-5 sm:px-8 md:px-16 lg:px-24 mb-10 sm:mb-16 text-center">
        <h2
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold"
        >
          Interested in{" "}
          <span className="gradient-text">Collaboration?</span>
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative py-4 sm:py-6 mb-10 sm:mb-16">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 z-10" style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 z-10" style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />

        <div className="marquee whitespace-nowrap" style={{ animationDuration: "45s" }}>
          <span className="text-4xl sm:text-6xl md:text-8xl font-bold mx-2 sm:mx-4 tracking-tight" style={{ color: "var(--text-faint)" }}>
            {repeatedText}
          </span>
          <span className="text-4xl sm:text-6xl md:text-8xl font-bold mx-2 sm:mx-4 tracking-tight" style={{ color: "var(--text-faint)" }}>
            {repeatedText}
          </span>
        </div>
      </div>

      {/* Second marquee going opposite direction */}
      <div className="relative py-4 sm:py-6">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 z-10" style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 z-10" style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />

        <div className="whitespace-nowrap" style={{
          display: "flex",
          width: "max-content",
          animation: "marquee 55s linear infinite reverse",
        }}>
          <span className="text-4xl sm:text-6xl md:text-8xl font-bold mx-2 sm:mx-4 tracking-tight" style={{ color: "var(--text-faint)" }}>
            {repeatedText}
          </span>
          <span className="text-4xl sm:text-6xl md:text-8xl font-bold mx-2 sm:mx-4 tracking-tight" style={{ color: "var(--text-faint)" }}>
            {repeatedText}
          </span>
        </div>
      </div>
    </section>
  );
}
