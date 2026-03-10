"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description: "Building scalable and highly interactive user interfaces with modern toolchains.",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "TailwindCSS", "SCSS"],
    colSpan: "lg:col-span-2",
  },
  {
    title: "Motion & Animation",
    description: "Crafting fluid, premium web experiences and micro-interactions.",
    skills: ["GSAP", "Framer Motion", "Lenis"],
    colSpan: "lg:col-span-1",
  },
  {
    title: "Creative & Design",
    description: "Bridging the gap between engineering and design systems.",
    skills: ["Figma", "Adobe XD", "Responsive Design", "UI/UX"],
    colSpan: "lg:col-span-1",
  },
  {
    title: "Backend & Workflow",
    description: "Ensuring end-to-end delivery and robust architecture.",
    skills: ["Node.js", "REST APIs", "GraphQL", "Git", "Docker", "CI/CD"],
    colSpan: "lg:col-span-2",
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Mouse spotlight logic
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    
    // We update CSS custom properties on the cards instead of using React state 
    // to avoid re-rendering the entire component tree on every single pixel mouse move.
    // This is much more performant for 60fps animations.
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Quote entrance
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Bento Cards Stagger Entrance
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Quote */}
      <div
        ref={quoteRef}
        className="px-5 sm:px-8 md:px-16 lg:px-24 mb-16 sm:mb-24"
      >
        <span className="text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 block font-medium" style={{ color: "var(--accent)" }}>
          Skills
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-snug sm:leading-tight">
          I have a strong obsession for{" "}
          <span className="gradient-text">attention to detail.</span>
        </h2>
      </div>

      {/* Modern Bento Grid Skills Section */}
      <div className="px-5 sm:px-8 md:px-16 lg:px-24">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">My Arsenal</span>
        </h3>
        
        <div 
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 group"
        >
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              ref={(el) => {
                 cardsRef.current[index] = el;
              }}
              className={`relative overflow-hidden rounded-3xl glass-card p-8 sm:p-10 flex flex-col justify-between transition-colors duration-500 hover:border-cyan-accent/30 ${category.colSpan}`}
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--divider)",
                borderWidth: "1px",
              }}
            >
              {/* Mouse Spotlight Overlay */}
              <div 
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), var(--accent-glow, rgba(54, 209, 220, 0.15)), transparent 40%)`
                }}
              />

              <div className="relative z-20">
                <h4 className="text-xl sm:text-2xl font-bold mb-2 shadow-sm" style={{ color: "var(--text-primary)" }}>
                  {category.title}
                </h4>
                <p className="text-sm sm:text-base mb-8 max-w-md" style={{ color: "var(--text-secondary)" }}>
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-transform duration-300 hover:scale-105"
                      style={{ 
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--divider)"
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
