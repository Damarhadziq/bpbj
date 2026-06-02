export default function NewsHero() {
  return (
    <header className="pt-32 pb-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-1 w-10 bg-primary"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Transparansi Informasi</span>
      </div>
      <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Warta Pengadaan</h1>
      <p className="max-w-3xl text-base font-medium leading-8 text-slate-600 md:text-lg">
        Pusat informasi resmi Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang. Menyajikan pembaruan terkini mengenai informasi, sosialisasi, regulasi, dan kegiatan pemerintah.
      </p>
    </header>
  );
}
