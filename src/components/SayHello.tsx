"use client";

import { motion, useReducedMotion } from "motion/react";
import CopyEmail from "./CopyEmail";
import MagneticButton from "./MagneticButton";
import { site } from "@/data/content";

export default function SayHello() {
  const shouldReduceMotion = useReducedMotion();
  const words = ["LET'S", "MAKE", "A", "MEMORY."];

  return (
    <section
      aria-label="Say Hello"
      className="relative w-full min-h-svh flex flex-col justify-between px-6 sm:px-12 md:px-16 py-16 md:py-24 bg-[var(--bg)] border-t border-[var(--line)] overflow-hidden"
    >
      {/* Chapter Label */}
      <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
          05 / Say hello
        </span>
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {site.location}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1440px] mx-auto my-auto flex flex-col items-start gap-12 py-12">
        {/* Animated Heading: LET'S MAKE A MEMORY. (each word slides up on enter) */}
        <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-1 select-none">
          {words.map((word, index) => (
            <div key={`${word}-${index}`} className="overflow-hidden">
              <motion.span
                initial={
                  shouldReduceMotion
                    ? { y: 0, opacity: 1 }
                    : { y: "110%", opacity: 0 }
                }
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: 0.08 * index,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block font-['Bebas_Neue',sans-serif] text-[clamp(3.5rem,11vw,9.5rem)] leading-[0.9] text-[var(--fg)] tracking-tight"
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Contact links & Copy action */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-10 pt-4">
          <CopyEmail />

          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] hover:underline transition-colors"
            >
              Instagram {site.instagramHandle} ↗
            </a>
            <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] hover:underline transition-colors"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>

        {/* Large Magnetic Button */}
        <div className="pt-2 -ml-4">
          <MagneticButton href="/contact">
            Get in touch
          </MagneticButton>
        </div>
      </div>

      {/* Bottom spacer / cue */}
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center text-xs uppercase tracking-widest text-[var(--muted)] pt-8 border-t border-[var(--line)]">
        <span>Available for bookings & travel</span>
        <span>Aswin Krishna © 2026</span>
      </div>
    </section>
  );
}
