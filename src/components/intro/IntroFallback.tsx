type IntroFallbackProps = {
  onContinue: () => void;
};

export function IntroFallback({ onContinue }: IntroFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[color:var(--color-stone-ink)] px-6 text-center text-[color:var(--color-stone-cream)]">
      <p className="font-[family-name:var(--font-display)] text-2xl">Hamman Madencilik</p>
      <p className="max-w-sm text-sm text-[color:var(--color-stone-cream)]/70">
        Doğanın taşına, ustanın dokunuşu.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="border border-[color:var(--color-stone-cream)]/40 px-6 py-3 text-xs uppercase tracking-[0.08em]"
      >
        Ana Sayfaya Geç
      </button>
    </div>
  );
}
