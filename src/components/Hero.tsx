type HeroProps = {
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
};

export function Hero({ eyebrow, title, emphasis, description }: HeroProps) {
  return (
    <section className="flex min-h-[70vh] flex-col justify-center gap-4 px-6 py-16 md:flex-row md:items-center md:gap-12 md:px-16">
      <div className="max-w-xl">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[color:var(--color-stone-bronze)]">
          {eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl">
          {title}
          <br />
          <em className="not-italic text-[color:var(--color-stone-bronze)]">{emphasis}</em>
        </h1>
        <p className="mt-4 max-w-md text-sm text-[color:var(--color-stone-ink)]/80">{description}</p>
      </div>
      <div
        aria-hidden="true"
        className="h-64 w-full rounded-sm bg-gradient-to-br from-white via-[color:var(--color-stone-sand)] to-[#C9BFA6] md:h-80 md:flex-1"
      />
    </section>
  );
}
