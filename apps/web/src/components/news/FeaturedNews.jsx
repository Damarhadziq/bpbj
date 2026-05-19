export default function FeaturedNews() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
      {/* Featured News (Large) */}
      <article className="md:col-span-8 group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low aspect-[16/9] mb-6">
          <img alt="Construction project site" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGcGY7M-YFzkb555n3g7YiZzzbM6W5bmtXFAbfriB-dKO2TFFy9HogjqHKumkDq8WMjo0ljM76w4U4QgGvJKSYGNZm4_V-aes2TjEvLdId8NnDzPUtsHw7EG0kYCzzgUCh22XfYqnROWkffTk14NpT_Cji6hPXOMUMXFPEFCUnF6kRxLAkICuZH0lOoM2e7CXgD8LFo9zT8-JUSJXxSJqU2R8J0vXg-ZyT-KDATUFIYLVcURS28ltIOQY6x7hzD05Lsul8LbVHHQ"/>
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 bg-tertiary-container text-white text-[10px] font-black uppercase tracking-widest rounded-sm">PENGUMUMAN UTAMA</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            <span>12 OKT 2024</span>
            <span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
            <span>ADMIN BPBJ</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface group-hover:text-primary transition-colors mb-4 leading-tight">Implementasi E-Katalog Lokal Versi Terbaru untuk Percepatan Pembangunan Kota Semarang</h2>
          <p className="text-on-surface-variant text-base leading-relaxed line-clamp-2">
            Pemerintah Kota Semarang melalui Bagian Pengadaan Barang dan Jasa mengumumkan pembaruan sistem E-Katalog Lokal yang bertujuan untuk mempermudah UMKM dalam berpartisipasi dalam proyek daerah.
          </p>
        </div>
      </article>

      {/* Sidebar News Items */}
      <div className="md:col-span-4 flex flex-col gap-8">
        <article className="group cursor-pointer">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low mb-4">
            <img alt="Office meeting" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDit6E2gFi_iiTSbzJSjmnChYpfdkKnlnOp4Z16wEl3lL9UOeCOqAa_HdOj1-fgkOH29jdetV5ozbOIyipddw-zPgvmqf9KV9RPUIHw5UT_Z1mi_vTKQ2I9XS3sD9AUa7xgRszPAaaHtvk6Oa2dEMQk7a0VqGy1dHoYqv9xh-3YfLvVJIqmkX9w_H7FlZT6nYWHXKKt979FgTkuvXxc3ujPFp9VtokKJ94HXvU5lBZqKSzt8c3sNqpXVgOgGMzrHnpXPvGvAb0Wbw"/>
          </div>
          <span className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-2 block">KEGIATAN</span>
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">Workshop Peningkatan Kapasitas PPK dan PPTK se-Kota Semarang</h3>
        </article>

        <article className="group cursor-pointer">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low mb-4">
            <img alt="Signing documents" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDMeT5HlGsKJnJ3o8h2DT85FHHUJ7G_ZR_hkiMcKU9Y6w5tzhJhJVXL2FFrvneAcqH0zUyG-Sc3F02XCjw47mbGkp1DmxEWS-Wku8LuVL-VOdNVyhuFiSFUUnewu3VAXK-kjbJc-rDSTIYUw3UeSBI8sJt6797q2cVGW7ZaHZWhnJjUY3uHyJOL67Fz-MxAkc0lkEwfdnq9obHjoggtnzFw9XpXzBlz0llhQhkedD9FK_PiTR8_nkNHRTO3zwMoNnvWD0nyC7j0Q"/>
          </div>
          <span className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-2 block">LAYANAN</span>
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">Prosedur Baru Pengajuan Konsultasi Pengadaan Secara Daring</h3>
        </article>
      </div>
    </div>
  );
}
