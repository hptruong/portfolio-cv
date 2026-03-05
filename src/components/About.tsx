"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;

      const words = textRef.current.querySelectorAll(".about-word");

      // Scroll text opacity animation
      gsap.fromTo(
        words,
        {
          opacity: 0.2,
          color: "var(--text-primary)", // All text is white
        },
        {
          opacity: 1,
          stagger: 0.1, 
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: true,
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const dimWords = ["I", "am", "a", "passionate", "UI", "Engineer", "who", "bridges", "the", "gap", "between", "development", "and", "design."];
  const highlightWords = ["I", "take", "responsibility", "to", "craft", "a", "good", "user", "experience", "using", "modern", "frontend", "architecture."];

  return (
    <section
      ref={sectionRef}
      className="min-h-[70vh] sm:min-h-screen flex items-center px-5 sm:px-8 md:px-16 lg:px-24 py-20 sm:py-32"
    >
      <h2
        ref={textRef}
        className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight max-w-5xl"
      >
        {dimWords.map((word, i) => (
          <span key={`dim-${i}`} className="about-word dim-text inline-block mr-[0.3em] will-animate">
            {word}
          </span>
        ))}
        {highlightWords.map((word, i) => (
          <span key={`hl-${i}`} className="about-word highlight-text inline-block mr-[0.3em] will-animate" style={{ color: "var(--text-primary)" }}>
            {word}
          </span>
        ))}
      </h2>
    </section>
  );
}
