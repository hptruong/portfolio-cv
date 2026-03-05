"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

const milestones = [
  {
    year: "2023",
    title: "Senior UI Engineer",
    company: "Leading Tech Company",
    description: "Leading frontend architecture and mentoring junior developers",
  },
  {
    year: "2022",
    title: "UI Engineer II",
    company: "DLT Labs",
    description: "Built enterprise-grade applications with React and Angular",
  },
  {
    year: "2021",
    title: "Open Source Contributor",
    company: "NPM / GitHub",
    description: "Published npm packages used by thousands of developers",
  },
  {
    year: "2020",
    title: "UI Engineer",
    company: "Huminos",
    description: "Developed marketing sites and web applications from scratch",
  },
  {
    year: "2019",
    title: "Frontend Developer",
    company: "Freelance",
    description: "Started freelancing and building websites for clients",
  },
  {
    year: "2018",
    title: "Computer Science Graduate",
    company: "AKGEC",
    description: "Graduated with expertise in web development and design",
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 85%", // Starts exactly when the top of the line hits 85% viewport
            end: "bottom 10%", // Finishes even later (bottom of line at 10%), making it trace much slower
            scrub: 1.5, // Added more smoothing
          },
        }
      );

      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll(".timeline-item");
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { y: 30, opacity: 0, filter: "blur(2px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        const dots = itemsRef.current.querySelectorAll(".timeline-dot");
        dots.forEach((dot) => {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.4,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: dot,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="timeline" className="py-16 sm:py-24 md:py-32">
      <div className="px-5 sm:px-8 md:px-16 lg:px-24 mb-10 sm:mb-16">
        <div ref={headerRef}>
          <span className="text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 block font-medium" style={{ color: "var(--accent)" }}>
            Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-sm sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            A quick recap of proud moments
          </p>
        </div>
      </div>

      {/* Timeline - left aligned on mobile, center on desktop */}
      <div className="relative px-5 sm:px-8 md:px-16 lg:px-24 max-w-5xl mx-auto">
        {/* Vertical line */}
        <div
          ref={lineRef}
          className="absolute left-7 sm:left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
          style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-secondary), transparent)" }}
        />

        <div ref={itemsRef} className="space-y-8 sm:space-y-12">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`timeline-item relative flex items-start gap-4 sm:gap-8 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Dot */}
              <div className="timeline-dot absolute left-7 sm:left-8 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 md:-translate-x-1/2 z-10 -translate-x-1/2" style={{ borderColor: "var(--accent)", backgroundColor: "var(--bg-primary)" }} />

              {/* Content */}
              <div
                className={`ml-12 sm:ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
                  index % 2 !== 0 ? "md:text-right" : ""
                }`}
              >
                <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: "var(--accent)" }}>
                  {milestone.year}
                </span>
                <h3 className="text-base sm:text-xl font-bold mt-0.5 sm:mt-1 mb-0.5 sm:mb-1" style={{ color: "var(--text-primary)" }}>
                  {milestone.title}
                </h3>
                <p className="font-medium text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: "var(--text-secondary)" }}>
                  {milestone.company}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {milestone.description}
                </p>
              </div>

              {/* Spacer for opposite side */}
              <div className="hidden md:block md:w-[calc(50%-40px)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
