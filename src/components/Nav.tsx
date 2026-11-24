"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import TransitionLink from "./TransitionLink";
import { site } from "@/data/content";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/recent", label: "Recent Arts" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile dropdown on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Handle outside click & Esc key for mobile dropdown
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-3 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="relative w-full max-w-[1440px] flex justify-center pointer-events-auto">
        {/* ========================================================= */}
        {/* DESKTOP FLOATING GLASS PILL (md and up)                    */}
        {/* ========================================================= */}
        <nav
          aria-label="Primary Navigation"
          className={`hidden md:flex items-center gap-2 p-1.5 rounded-full border border-white/12 transition-all duration-300 shadow-2xl ${
            isScrolled
              ? "bg-[#141414]/70 backdrop-blur-xl"
              : "bg-[#141414]/45 backdrop-blur-md"
          }`}
          style={{
            backgroundColor: isScrolled
              ? "rgba(20, 20, 20, 0.70)"
              : "rgba(20, 20, 20, 0.45)",
          }}
        >
          {/* "AK" Monogram linking to / */}
          <TransitionLink
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-full font-['Bebas_Neue',sans-serif] text-lg tracking-wider text-[var(--fg)] hover:text-[var(--accent)] hover:bg-white/5 transition-all ml-1 focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label={`${site.name} home`}
          >
            AK
          </TransitionLink>

          {/* Vertical divider */}
          <span className="w-[1px] h-4 bg-white/15 mx-1" aria-hidden="true" />

          {/* Links with sliding darker pill layoutId */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs uppercase tracking-[0.18em] rounded-full transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)] ${
                    isActive
                      ? "text-[var(--fg)] font-medium"
                      : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Sliding darker pill active background */}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-black/60 border border-white/10 shadow-inner z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </TransitionLink>
              );
            })}
          </div>

          {/* Vertical divider */}
          <span className="w-[1px] h-4 bg-white/15 mx-1" aria-hidden="true" />

          {/* Instagram Icon Link */}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--muted)] hover:text-[var(--fg)] hover:bg-white/[0.06] rounded-full transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label={`Instagram ${site.instagramHandle}`}
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* "Book" Button: off-white bg, black text, rounded-full */}
          <TransitionLink
            href="/contact"
            className="ml-1 px-4 py-1.5 rounded-full bg-[var(--fg)] text-black text-xs uppercase tracking-[0.18em] font-semibold hover:bg-white hover:scale-[1.03] transition-all shadow-md focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
          >
            Book
          </TransitionLink>
        </nav>

        {/* ========================================================= */}
        {/* MOBILE COMPACT FLOATING PILL (under 768px)                */}
        {/* ========================================================= */}
        <div className="w-full md:hidden flex flex-col items-center">
          <nav
            aria-label="Mobile Navigation Bar"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-full border border-white/12 transition-all duration-300 shadow-xl ${
              isScrolled
                ? "bg-[#141414]/75 backdrop-blur-xl"
                : "bg-[#141414]/50 backdrop-blur-md"
            }`}
          >
            {/* "AK" Monogram on left */}
            <TransitionLink
              href="/"
              className="flex items-center justify-center font-['Bebas_Neue',sans-serif] text-xl tracking-wider text-[var(--fg)] pl-2 hover:text-[var(--accent)]"
              aria-label={`${site.name} home`}
            >
              AK
            </TransitionLink>

            {/* Right side controls: Menu toggle and Book button */}
            <div className="flex items-center gap-2">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-[0.18em] text-[var(--fg)] hover:bg-white/10 transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-dropdown"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
                {/* Morphs icon to X */}
                <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">
                  {mobileMenuOpen ? "✕" : "☰"}
                </span>
              </button>

              <TransitionLink
                href="/contact"
                className="px-3.5 py-1.5 rounded-full bg-[var(--fg)] text-black text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-white transition-all shadow"
              >
                Book
              </TransitionLink>
            </div>
          </nav>

          {/* MOBILE DROPDOWN PANEL (directly under pill, not fullscreen) */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={dropdownRef}
                id="mobile-nav-dropdown"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: -10, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -10, scale: 0.98 }
                }
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full mt-2 p-6 rounded-3xl border border-white/12 bg-[#141414]/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-6 select-none z-50"
              >
                <div className="flex flex-col gap-2 pt-2">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 0, x: -10 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: shouldReduceMotion ? 0 : idx * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <TransitionLink
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block font-['Bebas_Neue',sans-serif] text-[2rem] leading-none tracking-wide py-1 transition-colors ${
                            isActive
                              ? "text-[var(--accent)]"
                              : "text-[var(--fg)] hover:text-[var(--accent)]"
                          }`}
                        >
                          {link.label}
                        </TransitionLink>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs uppercase tracking-widest text-[var(--muted)]">
                  <span>{site.location}</span>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                  >
                    Instagram {site.instagramHandle} ↗
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
