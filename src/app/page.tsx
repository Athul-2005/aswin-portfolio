export default function Home() {
  return (
    <main id="main" className="px-4 sm:px-8 md:px-12 py-12 md:py-24 max-w-[1440px] mx-auto w-full">
      <section className="py-20 md:py-32 text-center flex flex-col items-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-6">
          Photography / Toronto, Ontario
        </p>
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(4.5rem,19vw,17rem)] leading-[0.9] text-[var(--fg)] tracking-tight">
          ASWIN KRISHNA
        </h1>
        <p className="font-serif italic text-[clamp(1.4rem,4vw,3.2rem)] text-[var(--fg)] max-w-[50ch] mx-auto mt-8 leading-snug">
          &ldquo;Curiosity makes me look twice. Passion makes me press the shutter.&rdquo;
        </p>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mt-8">
          Global Shell Loaded · Phase 1 Complete
        </p>
      </section>
    </main>
  );
}
