"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";
import { footerSocialLinks } from "@/data/socialLinks";

// Text scramble helper
const CHARS = "!<>-_\\/[]{}—=+*^?#_____";
function scrambleText(
  el: HTMLElement,
  finalText: string,
  duration: number = 1.5
) {
  let frame = 0;
  const totalFrames = Math.round(duration * 30); // ~30fps
  const queue = finalText.split("").map((char, i) => ({
    char,
    start: Math.floor(Math.random() * (totalFrames * 0.5)),
    end: Math.floor(totalFrames * 0.5 + Math.random() * (totalFrames * 0.5)),
  }));

  const update = () => {
    let output = "";
    let complete = 0;

    queue.forEach(({ char, start, end }) => {
      if (frame >= end) {
        complete++;
        output += char;
      } else if (frame >= start) {
        output += CHARS[Math.floor(Math.random() * CHARS.length)];
      } else {
        output += "\u00A0";
      }
    });

    el.textContent = output;

    if (complete < queue.length) {
      frame++;
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const scrambledRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );

      // Text scramble on scroll reveal
      if (headingRef.current) {
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 80%",
          onEnter: () => {
            if (!scrambledRef.current && headingRef.current) {
              scrambledRef.current = true;
              const span = headingRef.current.querySelector(".scramble-target") as HTMLElement;
              if (span) {
                scrambleText(span, "social media.", 1.5);
              }
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic effect on social icons (desktop only)
  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile || !socialsRef.current) return;

    const icons = socialsRef.current.querySelectorAll("a");
    const handlers: Array<{ el: HTMLElement; move: (e: globalThis.MouseEvent) => void; leave: () => void }> = [];

    icons.forEach((icon) => {
      const xTo = gsap.quickTo(icon, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(icon, "y", { duration: 0.3, ease: "power3.out" });

      const handleMove = (e: globalThis.MouseEvent) => {
        const rect = icon.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.4);
        yTo(relY * 0.4);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      icon.addEventListener("mousemove", handleMove);
      icon.addEventListener("mouseleave", handleLeave);
      handlers.push({ el: icon, move: handleMove, leave: handleLeave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <footer ref={sectionRef} id="contact" className="py-16 sm:py-24 pb-8 sm:pb-12">
      <div ref={contentRef} className="px-5 sm:px-8 md:px-16 lg:px-24 text-center">
        <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-8">
          Connect with me on{" "}
          <span className="gradient-text scramble-target">social media.</span>
        </h2>

        {/* Social Links */}
        <div ref={socialsRef} className="flex items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-10 flex-wrap">
          {footerSocialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform duration-300"
              style={{ color: "var(--text-secondary)" }}
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 flex-wrap">
          <a
            href="#"
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm tracking-wider uppercase relative overflow-hidden group"
            style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
          >
            <span className="relative z-10">Resume</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
          <a
            href="#"
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase relative overflow-hidden group"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
          >
            <span className="relative z-10">Let&apos;s Talk</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
        </div>

        {/* Divider */}
        <div className="h-px mb-6 sm:mb-8" style={{ backgroundColor: "var(--divider)" }} />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
          <p>
            Designed and Developed with{" "}
            <span className="text-red-400">❤</span> by{" "}
            <span style={{ color: "var(--accent)" }}>Julian Truong</span>
          </p>
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
