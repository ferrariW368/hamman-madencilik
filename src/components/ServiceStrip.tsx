type ServiceStripItem = {
  _id: string;
  baslik: string;
};

type ServiceStripProps = {
  items: ServiceStripItem[];
};

export function ServiceStrip({ items }: ServiceStripProps) {
  const visible = items.slice(0, 4);

  return (
    <ul className="grid grid-cols-1 gap-px bg-[color:var(--color-stone-sand)] sm:grid-cols-2 md:grid-cols-4">
      {visible.map((item, index) => (
        <li key={item._id} className="bg-[color:var(--color-stone-cream)] p-6">
          <span className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-1 text-sm">{item.baslik}</p>
        </li>
      ))}
    </ul>
  );
}
