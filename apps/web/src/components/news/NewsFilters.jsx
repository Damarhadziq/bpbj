export default function NewsFilters() {
  return (
    <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex flex-wrap gap-3">
        <button className="px-6 py-2 rounded-full bg-primary text-on-primary text-sm font-bold shadow-sm">Semua</button>
        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-surface-variant transition-colors shadow-sm">Pengumuman</button>
        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-surface-variant transition-colors shadow-sm">Kegiatan</button>
        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-medium hover:bg-surface-variant transition-colors shadow-sm">Layanan</button>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">tune</span>
          <select className="appearance-none bg-surface-container-low border-none rounded-lg pl-12 pr-10 py-3 text-sm font-medium focus:ring-2 focus:ring-primary w-full md:w-48 outline-none">
            <option>Terbaru</option>
            <option>Terpopuler</option>
            <option>Terlama</option>
          </select>
        </div>
      </div>
    </section>
  );
}
