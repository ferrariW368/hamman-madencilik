export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--color-stone-sand)] px-6 py-8 text-xs text-[color:var(--color-stone-ink)]/70 md:px-16">
      <p>© {year} Hamman Madencilik. Tüm hakları saklıdır.</p>
    </footer>
  );
}
