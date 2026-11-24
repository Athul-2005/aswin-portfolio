"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isOverHero = pathname === "/" && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#000000]/75 backdrop-blur-md border-b border-[var(--line)] py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
          <TransitionLink
            href="/"
            className="font-['Bebas_Neue',sans-serif] text-2xl sm:text-3xl tracking-widest text-[var(--fg)] hover:text-[var(--accent)] transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label={`${site.name} home`}
          >
            {isOverHero ? "AK" : "ASWIN KRISHNA"}
          </TransitionLink>

          {/* Desktop Nav */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-[var(--accent)] font-medium"
                      : "text-[var(--muted)] hover:text-[var(--accent)] hover:underline"
                  }`}
                >
                  {link.label}
                </TransitionLink>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xs uppercase tracking-[0.18em] text-[var(--fg)] px-3 py-1.5 border border-[var(--line)] hover:border-[var(--fg)] transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col justify-between p-6 sm:p-12 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-6">
              <span className="font-['Bebas_Neue',sans-serif] text-2xl tracking-widest text-[var(--fg)]">
                ASWIN KRISHNA
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--fg)] p-2"
                aria-label="Close menu"
              >
                Close ✕
              </button>
            </div>

            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col gap-6 my-auto"
            >
              {NAV_LINKS.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 * index,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <TransitionLink
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-['Bebas_Neue',sans-serif] text-5xl tracking-wider block transition-colors ${
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
            </nav>

            <div className="border-t border-[var(--line)] pt-6 flex flex-col gap-2 text-xs tracking-widest uppercase text-[var(--muted)]">
              <span>{site.location}</span>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)]"
              >
                Instagram {site.instagramHandle} ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
