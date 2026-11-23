import Link from "next/link";
import { site, processSteps } from "@/data/content";

export const metadata = {
  title: "Contact | Aswin Krishna Photography Toronto",
  description: "Get in touch with Aswin Krishna for weddings, nature, and portrait sessions in Toronto.",
};

export default function ContactPage() {
  return (
    <main id="main" className="min-h-svh p-6 md:p-12 flex flex-col justify-between">
      <header className="flex justify-between items-center py-4 border-b border-[var(--line)]">
        <Link href="/" className="font-['Bebas_Neue',sans-serif] text-2xl tracking-wider text-[var(--fg)] hover:text-[var(--accent)]">
          ← Aswin Krishna
        </Link>
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Phase 0 Placeholder
        </span>
      </header>

      <section className="py-16 max-w-[60ch]">
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3rem,11vw,9rem)] leading-[0.9] text-[var(--fg)] mb-6">
          CONTACT
        </h1>
        <p className="font-serif italic text-[clamp(1.4rem,3.5vw,2.5rem)] text-[var(--fg)] mb-8">
          Tell me the date, the place and what matters most.
        </p>
        <p className="text-[var(--muted)] mb-8 leading-relaxed">
          {site.location}. Available across the Greater Toronto Area and for travel.
        </p>
        <div className="space-y-4">
          {processSteps.map((step) => (
            <div key={step.numeral} className="border-t border-[var(--line)] pt-3">
              <span className="text-xs text-[var(--accent)] uppercase tracking-widest mr-3">
                {step.numeral}. {step.title}
              </span>
              <p className="text-sm text-[var(--muted)] mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-6 border-t border-[var(--line)] text-xs uppercase tracking-widest text-[var(--muted)]">
        Contact Route Placeholder
      </footer>
    </main>
  );
}
