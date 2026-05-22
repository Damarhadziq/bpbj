export default function GalleryHero() {
  return (
    <header className="max-w-7xl mx-auto px-6 mb-12 pt-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-primary text-on-primary text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-4">Documentation Archive</span>
          <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-none mb-4">GALERI <span className="text-primary">KEGIATAN</span></h1>
          <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">Transparansi melalui dokumentasi visual. Arsip resmi kegiatan Bagian Pengadaan Barang/Jasa Kota Semarang dalam mewujudkan tata kelola pemerintahan yang bersih.</p>
        </div>
      </div>
    </header>
  );
}
