import Link from "next/link";

const NAV_LINKS = [
  { href: "/hizmetlerimiz", label: "Hizmetler" },
  { href: "/urunlerimiz", label: "Ürünler" },
  { href: "/santiyelerimiz", label: "Şantiyeler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-[color:var(--color-stone-sand)] px-6 py-4 md:px-16">
      <Link href="/" className="font-[family-name:var(--font-display)] text-lg tracking-wide">
        HAMMAN{" "}
        <span className="font-[family-name:var(--font-body)] text-xs tracking-[0.1em] text-[color:var(--color-stone-bronze)]">
          MADENCİLİK
        </span>
      </Link>
      <nav aria-label="Ana menü">
        <ul className="flex gap-5 text-xs tracking-[0.06em]">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label.toLocaleUpperCase("tr-TR")}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
