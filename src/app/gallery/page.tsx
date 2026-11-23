import Link from "next/link";
import { galleryPhotos } from "@/data/photos";

export const metadata = {
  title: "Gallery | Aswin Krishna Photography Toronto",
  description: "Portfolio gallery of nature, wedding, and casual photography in Toronto and beyond.",
};

export default function GalleryPage() {
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
          GALLERY
        </h1>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-8">
          Total items: {galleryPhotos.length} photos ready in catalog
        </p>
        <div className="flex gap-4 mb-12">
          {["All", "Nature", "Wedding", "Casual"].map((filter) => (
            <span
              key={filter}
              className="px-4 py-2 text-xs uppercase tracking-[0.18em] border border-[var(--line)] text-[var(--fg)]"
            >
              {filter}
            </span>
          ))}
        </div>
      </section>

      <footer className="py-6 border-t border-[var(--line)] text-xs uppercase tracking-widest text-[var(--muted)]">
        Gallery Route Placeholder
      </footer>
    </main>
  );
}
