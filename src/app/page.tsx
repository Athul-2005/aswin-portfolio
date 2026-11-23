import Link from "next/link";
import { site } from "@/data/content";

export default function Home() {
  return (
    <main id="main" className="min-h-svh flex flex-col justify-between p-6 md:p-12">
      <header className="flex justify-between items-center py-4 border-b border-[var(--line)]">
        <div>
          <h1 className="font-['Bebas_Neue',sans-serif] text-3xl md:text-5xl tracking-wider text-[var(--fg)]">
            {site.name}
          </h1>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mt-1">
            {site.tagline}
          </p>
        </div>
        <nav aria-label="Main Navigation" className="flex gap-6 text-sm tracking-widest uppercase">
          <Link href="/gallery" className="text-[var(--muted)] hover:text-[var(--accent)] hover:underline">
            Gallery
          </Link>
          <Link href="/recent" className="text-[var(--muted)] hover:text-[var(--accent)] hover:underline">
            Recent Arts
          </Link>
          <Link href="/contact" className="text-[var(--muted)] hover:text-[var(--accent)] hover:underline">
            Contact
          </Link>
        </nav>
      </header>

      <section className="my-auto py-24 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-4">
          Chapter 00 / Phase 0 Foundation
        </p>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[clamp(4rem,14vw,12rem)] leading-[0.9] text-[var(--fg)]">
          ASWIN KRISHNA
        </h2>
        <p className="font-serif italic text-[clamp(1.4rem,3vw,2.5rem)] text-[var(--muted)] max-w-[60ch] mx-auto mt-6">
          &ldquo;Curiosity makes me look twice. Passion makes me press the shutter.&rdquo;
        </p>
      </section>

      <footer className="py-6 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between items-center text-xs tracking-widest uppercase text-[var(--muted)] gap-4">
        <span>© 2026 {site.name} · {site.location}</span>
        <span className="text-[var(--accent)]">Phase 0: Foundation Complete</span>
      </footer>
    </main>
  );
}
