"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapSetup";
import { socialLinks } from "@/data/socialLinks";

// Floating particle positions (hoisted static data)
const particles = [
  { size: 4, x: "15%", y: "20%", delay: 0, duration: 6 },
  { size: 6, x: "75%", y: "15%", delay: 1.5, duration: 8 },
  { size: 3, x: "85%", y: "60%", delay: 0.8, duration: 7 },
  { size: 5, x: "25%", y: "70%", delay: 2, duration: 9 },
  { size: 3, x: "60%", y: "80%", delay: 1, duration: 6.5 },
];

// Character split helper
function splitChars(text: string) {
  return text.split("").map((char, i) => (
    <span
      key={i}
      className="char-reveal inline-block"
      style={{ display: char === " " ? "inline" : "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 2.2,
      });

      // Background fade in
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 2 });

      // Character-split reveal: each char animates with clipPath + y
      const chars = nameRef.current?.querySelectorAll(".char-reveal");
      if (chars) {
        tl.fromTo(
          chars,
          {
            y: 120,
            opacity: 0,
            rotateX: 90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.03,
            duration: 1.4,
            ease: "expo.out",
          },
          "-=1.5"
        );
      }

      // Subtitle typewriter reveal
      if (subtitleRef.current) {
        const words = subtitleRef.current.querySelectorAll(".word-reveal");
        tl.fromTo(
          words,
          { y: 20, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.06,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.8"
        );
      }

      // Social links stagger
      if (socialRef.current) {
        tl.fromTo(
          socialRef.current.children,
          { y: 20, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.5"
        );
      }

      // Buttons slide up
      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        );
      }

      // Floating particles continuous animation
      if (particlesRef.current) {
        const dots = particlesRef.current.querySelectorAll(".particle");
        dots.forEach((dot, i) => {
          gsap.fromTo(
            dot,
            { opacity: 0, scale: 0 },
            { opacity: 0.6, scale: 1, duration: 1, delay: 2.5 + particles[i].delay, ease: "power2.out" }
          );
          gsap.to(dot, {
            y: "random(-30, 30)",
            x: "random(-20, 20)",
            duration: particles[i].duration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: particles[i].delay,
          });
        });
      }
    }, sectionRef);

    // Magnetic buttons effect
    const buttons = buttonsRef.current?.querySelectorAll("a");
    const magneticHandlers: Array<{
      el: HTMLAnchorElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];

    if (buttons) {
      buttons.forEach((btn) => {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

        const handleMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - rect.left - rect.width / 2;
          const relY = e.clientY - rect.top - rect.height / 2;
          xTo(relX * 0.3);
          yTo(relY * 0.3);
        };

        const handleLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", handleMove);
        btn.addEventListener("mouseleave", handleLeave);
        magneticHandlers.push({ el: btn, move: handleMove, leave: handleLeave });
      });
    }

    return () => {
      ctx.revert();
      magneticHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-24 pt-20 sm:pt-0 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 opacity-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(var(--divider) 1px, transparent 1px),
            linear-gradient(90deg, var(--divider) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }} />
        <div className="absolute top-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
        />
      </div>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
              background: "var(--accent)",
              boxShadow: `0 0 ${p.size * 3}px var(--accent)`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl">
        {/* Name with character split */}
        <div
          ref={nameRef}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 leading-tight overflow-hidden"
          style={{ perspective: "500px" }}
        >
          <h1>
            {splitChars("I am ")}<br className="sm:hidden" />
            <span className="gradient-text">{splitChars("Julian Truong")}</span>
          </h1>
        </div>

        {/* Subtitle with word reveal */}
        <p
          ref={subtitleRef}
          className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {"A creative UI Engineer crafting beautiful digital experiences".split(" ").map((word, i) => (
            <span key={i} className="word-reveal inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>

        <div ref={socialRef} className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 hover:-translate-y-1 p-1 transition-transform duration-300"
              style={{ color: "var(--text-muted)" }}
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div ref={buttonsRef} className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <a
            href="#"
            className="magnetic-btn px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm tracking-wider uppercase relative overflow-hidden group"
            style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
          >
            <span className="relative z-10">Resume</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
          <a
            href="#contact"
            className="magnetic-btn px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase relative overflow-hidden group"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
          >
            <span className="relative z-10">Let&apos;s Talk</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
        </div>
      </div>
    </section>
  );
}
