"use client";

// Same reasoning as InfoPanel: this binds onClick and so is client-only, but it
// was relying on IntroScene's directive to say so. Declared locally now.

type IntroFallbackProps = {
  onContinue: () => void;
};

export function IntroFallback({ onContinue }: IntroFallbackProps) {
  return (
    // This is the entire experience for reduced-motion and no-WebGL visitors —
    // the only screen they ever see on this route — so the two things it was
    // missing matter more here than they would anywhere else.
    //
    // min-h-dvh, not min-h-screen: 100vh on iOS Safari is the LARGEST viewport
    // height, the one with the URL bar collapsed, so with the bar expanded this
    // centred column sat ~40-50px below true centre. dvh tracks the viewport
    // that is actually there.
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[color:var(--color-stone-ink)] px-6 text-center text-[color:var(--color-stone-cream)]">
      {/* An <h1>, not a <p>. The company name is the title of this screen, and
          as a paragraph it gave the page no heading element at all — so the
          accessibility-sensitive path was the one route on the site a screen
          reader could not get a document outline for. Styling is unchanged. */}
      <h1 className="font-[family-name:var(--font-display)] text-2xl">Hamman Madencilik</h1>
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
