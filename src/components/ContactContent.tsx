"use client";

import { motion, useReducedMotion } from "motion/react";
import CopyEmail from "@/components/CopyEmail";
import { site, processSteps } from "@/data/content";

export default function ContactContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full">
      {/* Intro Header */}
      <header className="mb-16">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
          Get In Touch
        </span>
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] text-[var(--fg)] tracking-tight mt-2">
          CONTACT
        </h1>
        <p className="font-serif italic text-[clamp(1.5rem,3.5vw,2.8rem)] text-[var(--fg)] max-w-[45ch] mt-6 leading-snug">
          &ldquo;Tell me the date, the place and what matters most.&rdquo;
        </p>
      </header>

      {/* Main Grid: Channels on left, Process on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
        {/* Left Column: Direct Inquiries */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] block mb-3 font-semibold">
              Email
            </span>
            <CopyEmail />
          </div>

          <div className="border-t border-[var(--line)] pt-8">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] block mb-3 font-semibold">
              Direct Channels
            </span>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--fg)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
              >
                <span>Instagram</span>
                <span className="text-xs text-[var(--muted)]">({site.instagramHandle})</span>
                <span className="text-xs text-[var(--accent)]">↗</span>
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--fg)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
              >
                <span>WhatsApp</span>
                <span className="text-xs text-[var(--accent)]">↗</span>
              </a>
            </div>
          </div>

          <div className="border-t border-[var(--line)] pt-8">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] block mb-3 font-semibold">
              Location & Availability
            </span>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Based in Toronto, Ontario. Available across the Greater Toronto Area and for travel worldwide.
            </p>
          </div>
        </div>

        {/* Right Column: Process (Numbered rows I to IV fading up on scroll) */}
        <div className="lg:col-span-7 flex flex-col">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] block mb-8 font-semibold">
            How We Work Together
          </span>

          <div className="flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.numeral}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 25 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : idx * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="py-8 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10"
              >
                {/* Numeral */}
                <span className="font-['Bebas_Neue',sans-serif] text-3xl sm:text-4xl text-[var(--accent)] shrink-0 w-12">
                  {step.numeral}
                </span>

                {/* Title & Description */}
                <div className="flex-1">
                  <h3 className="font-['Bebas_Neue',sans-serif] text-2xl sm:text-3xl text-[var(--fg)] tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
