"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapSetup";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Works", href: "#works" },
  { label: "Skills", href: "#skills" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Update header backdrop based on scroll AND theme
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 100) {
        header.style.backdropFilter = "blur(20px)";
        header.style.backgroundColor =
          theme === "light"
            ? "rgba(245, 247, 250, 0.9)"
            : "rgba(26, 26, 46, 0.9)";
      } else {
        header.style.backdropFilter = "none";
        header.style.backgroundColor = "transparent";
      }
    };

    // Re-run immediately when theme changes
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [theme]);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        clipPath: "circle(150% at 95% 5%)",
        duration: 1,
        ease: "expo.inOut",
      });
      gsap.fromTo(
        linksRef.current?.children || [],
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.08, delay: 0.4, duration: 0.7, ease: "power3.out" }
      );
    } else {
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at 95% 5%)",
        duration: 0.7,
        ease: "expo.inOut",
      });
    }
  }, [isOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition duration-300"
      >
        <div className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 sm:py-6">
          {/* Logo */}
          <a 
            href="#home" 
            className="relative z-[51]"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsOpen(false); // Also close menu if it's open
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 40 40"
              fill="none"
              className="hover:text-cyan-accent transition-colors sm:w-[30px] sm:h-[30px]"
              style={{ color: "var(--text-primary)" }}
            >
              <path
                d="M20 2L38 38H2L20 2Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </a>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Hamburger / Close */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[51] w-7 h-5 sm:w-8 sm:h-6 group"
              aria-label="Toggle menu"
            >
              <span
                className="absolute left-0 h-0.5 transition-[width,transform,top,bottom,background-color] duration-300 origin-center"
                style={{
                  backgroundColor: "var(--text-primary)",
                  width: "100%",
                  top: isOpen ? "50%" : "0",
                  transform: isOpen ? "translateY(-50%) rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 transition-[width,opacity,background-color] duration-300"
                style={{
                  backgroundColor: "var(--text-primary)",
                  opacity: isOpen ? 0 : 1,
                  width: isOpen ? "100%" : "60%",
                }}
              />
              <span
                className="absolute left-0 h-0.5 transition-[width,transform,top,bottom,background-color] duration-300 origin-center"
                style={{
                  backgroundColor: "var(--text-primary)",
                  width: isOpen ? "100%" : "80%",
                  bottom: isOpen ? "auto" : "0",
                  top: isOpen ? "50%" : "auto",
                  transform: isOpen ? "translateY(-50%) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu — theme-aware */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          clipPath: "circle(0% at 95% 5%)",
          background: "linear-gradient(135deg, var(--bg-deep) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)",
        }}
      >
        <nav ref={linksRef} className="flex flex-col items-center gap-6 sm:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-3xl sm:text-4xl md:text-6xl font-bold transition-colors relative group"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 group-hover:w-full transition-[width,background-color] duration-300" style={{ backgroundColor: "var(--accent)" }} />
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
