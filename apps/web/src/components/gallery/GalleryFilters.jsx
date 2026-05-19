export default function GalleryFilters() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-8">
      <div className="flex flex-wrap gap-3 py-4 border-t border-outline-variant/20">
        <button className="px-6 py-2 bg-primary text-on-primary font-bold rounded-full text-sm">Semua Kegiatan</button>
        <button className="px-6 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors font-medium rounded-full text-sm">Rapat Koordinasi</button>
        <button className="px-6 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors font-medium rounded-full text-sm">Sosialisasi Pengadaan</button>
        <button className="px-6 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors font-medium rounded-full text-sm">Bimbingan Teknis</button>
        <button className="px-6 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors font-medium rounded-full text-sm">Kunjungan Kerja</button>
        <button className="px-6 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors font-medium rounded-full text-sm">Penghargaan</button>
      </div>
    </section>
  );
}
