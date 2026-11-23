import { recentArts } from "@/data/recent";

export const metadata = {
  title: "Recent Arts | Aswin Krishna Photography Toronto",
  description: "Latest photography pieces and Instagram updates by Aswin Krishna in Toronto.",
};

export default function RecentPage() {
  return (
    <main id="main" className="px-4 sm:px-8 md:px-12 py-12 md:py-24 max-w-[1440px] mx-auto w-full">
      <section className="py-8">
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3rem,11vw,9rem)] leading-[0.9] text-[var(--fg)] mb-6">
          RECENT ARTS
        </h1>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-8">
          Latest work · October 2026 ({recentArts.length} items catalogued)
        </p>
      </section>
    </main>
  );
}
