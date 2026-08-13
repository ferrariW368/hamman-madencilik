type InfoPanelProps = {
  title: string;
  description: string;
  fullPageHref?: string;
  onClose: () => void;
};

export function InfoPanel({ title, description, fullPageHref, onClose }: InfoPanelProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl border border-[color:var(--color-stone-cream)]/20 bg-[color:var(--color-stone-ink)]/90 p-6 text-[color:var(--color-stone-cream)] md:inset-x-auto md:right-10 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
      <button
        type="button"
        onClick={onClose}
        aria-label="Paneli kapat"
        className="absolute right-4 top-4 text-xs uppercase tracking-[0.08em]"
      >
        Kapat
      </button>
      <h3 className="font-[family-name:var(--font-display)] text-xl">{title}</h3>
      <p className="mt-3 text-sm text-[color:var(--color-stone-cream)]/80">{description}</p>
      {fullPageHref && (
        <a
          href={fullPageHref}
          className="mt-4 inline-block text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          Tüm Sayfayı Gör →
        </a>
      )}
    </div>
  );
}
