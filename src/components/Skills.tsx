"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

const skills = [
  { name: "JavaScript", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "React / Next.js", level: 92 },
  { name: "Angular", level: 85 },
  { name: "CSS / SCSS", level: 90 },
  { name: "TailwindCSS", level: 88 },
  { name: "Node.js", level: 80 },
  { name: "GSAP / Framer Motion", level: 85 },
];

const otherSkills = [
  "Figma",
  "Adobe XD",
  "After Effects",
  "Premiere Pro",
  "Git",
  "REST APIs",
  "GraphQL",
  "Firebase",
  "MongoDB",
  "Docker",
  "CI/CD",
  "Responsive Design",
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      if (skillsRef.current) {
        const skillBars = skillsRef.current.querySelectorAll(".skill-bar-fill");
        const skillItems = skillsRef.current.querySelectorAll(".skill-item");

        gsap.fromTo(
          skillItems,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        skillBars.forEach((bar) => {
          const width = bar.getAttribute("data-width") || "0";
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${width}%`,
              duration: 1.5,
              ease: "expo.out",
              scrollTrigger: {
                trigger: bar,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      if (otherRef.current) {
        gsap.fromTo(
          otherRef.current.children,
          { scale: 0.8, opacity: 0, y: 10 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.5,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: otherRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-16 sm:py-24 md:py-32">
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

      {/* Skills Section */}
      <div className="px-5 sm:px-8 md:px-16 lg:px-24">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
          <span className="gradient-text">My Skills</span>
        </h3>
        <p className="text-sm sm:text-lg mb-8 sm:mb-12 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          I like to take responsibility to craft aesthetic user experience
          using modern frontend architecture.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          {/* Skill bars */}
          <div ref={skillsRef} className="space-y-4 sm:space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="skill-item">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="font-medium text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                    {skill.name}
                  </span>
                  <span className="text-xs sm:text-sm font-mono" style={{ color: "var(--accent)" }}>
                    {skill.level}%
                  </span>
                </div>
                <div className="h-1 sm:h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--divider)" }}>
                  <div
                    className="skill-bar-fill h-full rounded-full"
                    data-width={skill.level}
                    style={{
                      background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Other skills */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6" style={{ color: "var(--text-secondary)" }}>
              Other Skills
            </h4>
            <div ref={otherRef} className="flex flex-wrap gap-2 sm:gap-3">
              {otherSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full glass-card text-xs sm:text-sm hover:border-cyan-accent/30 transition-all duration-300"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
