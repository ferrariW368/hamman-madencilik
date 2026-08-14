type InfoPanelProps = {
  title: string;
  description: string;
  fullPageHref?: string;
  onClose: () => void;
};

export function InfoPanel({ title, description, fullPageHref, onClose }: InfoPanelProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl border border-[color:var(--color-stone-cream)]/20 bg-[color:var(--color-stone-ink)]/90 p-6 text-[color:var(--color-stone-cream)] md:inset-x-auto md:right-10 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
      {/* The padding is the tap target, and the offset is reduced by exactly the
          padding so the lettering stays where it was: right-1 (4px) + p-3 (12px)
          puts the text at the same 16px inset as the old right-4 with no padding.
          Without it the hit box is the bare line box — measured 42.9 x 16 CSS px
          at 375x812, under WCAG 2.5.8's 24 x 24 minimum — and this is the only
          way to dismiss a panel on a phone, since there is deliberately no
          backdrop tap and no Escape handler. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Paneli kapat"
        className="absolute right-1 top-1 p-3 text-xs uppercase tracking-[0.08em]"
      >
        Kapat
      </button>
      <h3 className="font-[family-name:var(--font-display)] text-xl">{title}</h3>
      <p className="mt-3 text-sm text-[color:var(--color-stone-cream)]/80">{description}</p>
      {fullPageHref && (
        // Same trade as the close control: py-3 (12px) grows the 16px line box
        // to a 40px target, and mt-1 (4px) replaces mt-4 so the visible gap
        // above the link is the same 16px it was. Horizontal padding is left
        // alone because the link is already 140.7px wide.
        //
        // -mb-3 matters: unlike the close button this one is in flow, so the
        // extra 24px of padding would make the whole panel 12px taller — and at
        // portrait the panel is anchored `bottom-4`, so a taller panel pushes
        // its own heading and body upward. Pulling the bottom margin back by the
        // padding keeps the laid-out height at 4 + 40 - 12 = 32px, exactly the
        // 16 + 16 it was, so the hit box grows downward into the panel's own
        // p-6 padding and nothing visible moves. Measured: 0px drift on both
        // controls, panel height unchanged at 242px.
        <a
          href={fullPageHref}
          className="mt-1 -mb-3 inline-block py-3 text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          Tüm Sayfayı Gör →
        </a>
      )}
    </div>
  );
}
