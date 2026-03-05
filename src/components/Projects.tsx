"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

const projects = [
  {
    title: "FigGen - Figma to Code",
    description: "Pixel perfect HTML/Tailwind for Figma Auto layout designs.",
    tags: ["React", "TypeScript", "Figma API"],
    accent: "#6366f1",
  },
  {
    title: "ngx-quill-upload",
    description: "NPM Package for Quill JS uploads from Angular",
    tags: ["Angular", "TypeScript", "NPM"],
    accent: "#ef4444",
  },
  {
    title: "Huminos Website",
    description: "Marketing site for Huminos bots for workplace by facebook",
    tags: ["JavaScript", "Sass", "SVG"],
    accent: "#8b5cf6",
  },
  {
    title: "myOKR Website",
    description: "Marketing site for OKR Platform by huminos",
    tags: ["Next.js", "Tailwind", "React"],
    accent: "#3b82f6",
  },
  {
    title: "DLT Labs Website",
    description: "Marketing site with an Internal CMS from scratch",
    tags: ["Angular", "Node.js", "CMS"],
    accent: "#14b8a6",
  },
  {
    title: "DL Unify",
    description: "Built the application from zero to production 🚀",
    tags: ["React", "Redux", "REST API"],
    accent: "#06b6d4",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

      if (!isMobile) {
        const cards = cardsContainerRef.current;
        if (!cards || !scrollContainerRef.current) return;

        const totalScrollWidth = cards.scrollWidth - window.innerWidth + 300;

        // will-change for GPU compositing
        cards.style.willChange = "transform";

        gsap.to(cards, {
          x: -totalScrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: () => `+=${totalScrollWidth * 1.2}`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      } else {
        const cardElements = cardsContainerRef.current?.querySelectorAll(".project-card-wrapper");
        if (cardElements) {
          cardElements.forEach((card) => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // 3D tilt effect on project cards (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const cards = cardsContainerRef.current?.querySelectorAll(".project-card");
    if (!cards) return;

    const handlers: Array<{ el: HTMLElement; move: (e: globalThis.MouseEvent) => void; leave: () => void }> = [];

    cards.forEach((card) => {
      const el = card as HTMLElement;
      const shine = el.querySelector(".card-shine") as HTMLElement;

      const handleMove = (e: globalThis.MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;

        gsap.to(el, {
          rotateX,
          rotateY,
          duration: 0.4,
          ease: "power2.out",
          transformPerspective: 800,
        });

        // Move shine/light sweep
        if (shine) {
          gsap.to(shine, {
            x: x - rect.width / 2,
            y: y - rect.height / 2,
            opacity: 0.15,
            duration: 0.3,
          });
        }
      };

      const handleLeave = () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power3.out",
        });
        if (shine) {
          gsap.to(shine, { opacity: 0, duration: 0.4 });
        }
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      handlers.push({ el, move: handleMove, leave: handleLeave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} id="works" className="relative">
      <div ref={scrollContainerRef} className={isMobile ? "" : "min-h-screen"}>
        {/* Section header */}
        <div className="pt-16 sm:pt-24 pb-6 sm:pb-8 px-5 sm:px-8 md:px-16 lg:px-24">
          <div ref={headerRef}>
            <span className="text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 block font-medium" style={{ color: "var(--accent)" }}>
              Projects
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              <span className="gradient-text">My Works</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              I have contributed in over 20+ projects ranging from Frontend
              development, UI/UX design, Open Source, and Motion Graphics
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className={isMobile ? "px-5 pb-8" : "overflow-hidden"}>
          <div
            ref={cardsContainerRef}
            className={
              isMobile
                ? "flex flex-col gap-6"
                : "flex gap-8 px-8 md:px-16 lg:px-24 py-8"
            }
            style={isMobile ? {} : { width: "max-content" }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className={
                  isMobile
                    ? "project-card-wrapper w-full will-animate"
                    : "project-card-wrapper flex-shrink-0 w-[350px] md:w-[400px] will-animate"
                }
              >
                <div
                  className="project-card h-[320px] sm:h-[380px] md:h-[450px] rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--bg-card-border)",
                  }}
                >
                  {/* Decorative background */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute top-8 right-8 w-24 sm:w-32 h-24 sm:h-32 rounded-full"
                      style={{ background: `radial-gradient(circle, ${project.accent}, transparent)` }}
                    />
                    <div
                      className="absolute bottom-12 left-8 w-16 sm:w-24 h-16 sm:h-24 rounded-full"
                      style={{ background: `radial-gradient(circle, ${project.accent}, transparent)` }}
                    />
                  </div>

                  {/* Project thumbnail area */}
                  <div className="relative flex-1 flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-xl backdrop-blur-sm flex items-center justify-center overflow-hidden transition-colors duration-700"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--bg-card-border)",
                      }}
                    >
                      <div className="text-center p-4 sm:p-6">
                        <div
                          className="text-4xl sm:text-5xl font-bold opacity-20 mb-2 transition-opacity duration-500 group-hover:opacity-30"
                          style={{ color: project.accent }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full"
                              style={{
                                backgroundColor: "var(--bg-card)",
                                color: "var(--text-secondary)",
                                border: "1px solid var(--bg-card-border)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project info */}
                  <div className="relative mt-3 sm:mt-4">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 transition-colors duration-500" style={{ color: "var(--text-primary)" }}>
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Light sweep for 3D tilt */}
                  <div className="card-shine absolute w-[200%] h-[200%] rounded-full pointer-events-none opacity-0" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 50%)" }} />

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${project.accent}15, transparent 70%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
