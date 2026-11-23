import Link from "next/link";
import { recentArts } from "@/data/recent";

export const metadata = {
  title: "Recent Arts | Aswin Krishna Photography Toronto",
  description: "Latest photography pieces and Instagram updates by Aswin Krishna in Toronto.",
};

export default function RecentPage() {
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

      <section className="py-16">
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3rem,11vw,9rem)] leading-[0.9] text-[var(--fg)] mb-6">
          RECENT ARTS
        </h1>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-8">
          Latest work · October 2026 ({recentArts.length} items catalogued)
        </p>
      </section>

      <footer className="py-6 border-t border-[var(--line)] text-xs uppercase tracking-widest text-[var(--muted)]">
        Recent Arts Route Placeholder
      </footer>
    </main>
  );
}
