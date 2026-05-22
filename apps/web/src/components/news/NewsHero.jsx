export default function NewsHero() {
  return (
    <header className="mb-12 pt-32">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-12 h-1 bg-primary"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Transparansi Informasi</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface mb-4">Warta Pengadaan</h1>
      <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
        Pusat informasi resmi Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang. Menyajikan pembaruan terkini mengenai tender, regulasi, dan kegiatan pemerintah.
      </p>
    </header>
  );
}
