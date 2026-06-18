import { useMemo } from 'react';
import laporSemarLogo from '../assets/lapor-semar-awp.png';
import { useFloatingWidgets } from '../hooks/useFloatingWidgets';

const fallbackWidgetItems = [
  {
    label: 'Laporsemar',
    description: 'Laporkan aspirasi atau pengaduan melalui Lapor Semar',
    href: 'https://lapor.semarangkota.go.id',
    imageUrl: laporSemarLogo,
    openInNewTab: true,
  },
  {
    label: 'Pengaduan BPBJ',
    description: 'Kirim pengaduan langsung ke BPBJ Kota Semarang',
    href: '/contact#pengaduan',
    icon: 'forum',
    openInNewTab: false,
  },
  {
    label: 'Kontak BPBJ',
    description: 'Lihat alamat, email, dan nomor telepon BPBJ',
    href: '/contact',
    icon: 'support_agent',
    openInNewTab: false,
  },
];

const withLocalFallbackLogo = (items) => items.map((item) => {
  if (item.label?.toLowerCase().includes('laporsemar') && !item.imageUrl) {
    return { ...item, imageUrl: laporSemarLogo };
  }
  return item;
});

function WidgetButton({ item }) {
  return (
    <a
      href={item.href}
      target={item.openInNewTab ? '_blank' : undefined}
      rel={item.openInNewTab ? 'noreferrer' : undefined}
      title={item.label}
      aria-label={item.label}
      className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white text-primary shadow-lg shadow-red-950/15 transition-all duration-200 hover:-translate-x-1 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-white to-red-50" />
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="relative z-10 h-12 w-12 rounded-full object-contain"
          aria-hidden="true"
        />
      ) : (
        <span className="material-symbols-outlined relative z-10 text-[28px]">{item.icon}</span>
      )}
      <span className="pointer-events-none absolute right-[4.25rem] top-1/2 z-0 flex h-10 -translate-y-1/2 translate-x-2 items-center rounded-md bg-primary px-4 text-sm font-semibold leading-none text-white opacity-0 shadow-lg shadow-red-950/20 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        {item.label}
      </span>
    </a>
  );
}

export default function FloatingServiceWidget() {
  const { data: fetchedItems = [] } = useFloatingWidgets({
    staleTime: 5 * 60 * 1000,
  });
  const widgetItems = useMemo(() => {
    const sourceItems = fetchedItems.length > 0 ? fetchedItems : fallbackWidgetItems;
    return withLocalFallbackLogo(sourceItems);
  }, [fetchedItems]);

  return (
    <div className="fixed bottom-[60px] right-3 z-40 flex flex-col items-end gap-2 font-['Inter'] sm:right-5">
      <div className="flex flex-col items-end gap-2">
        {widgetItems.map((item) => (
          <WidgetButton key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}
