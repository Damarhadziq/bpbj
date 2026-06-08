export default function AboutSection() {
  return (
    <section className="scroll-mt-32" id="tentang-kami">
      <div className="hidden bg-primary w-12 h-1 mb-6 md:inline-block"></div>
      <h2 className="text-2xl font-bold text-on-surface tracking-tight mb-6 uppercase md:text-3xl md:font-extrabold md:mb-8">Tentang Kami</h2>
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">
        <div className="space-y-4 text-on-surface-variant leading-7 text-base md:space-y-6 md:text-lg md:leading-relaxed">
          <p>
            Bagian Pengadaan Barang dan Jasa (BPBJ) Kota Semarang adalah unit kerja strategis di bawah Sekretariat Daerah yang berdedikasi untuk menciptakan ekosistem pengadaan yang bersih, efektif, dan akuntabel.
          </p>
          <p>
            Kami bertindak sebagai katalisator pembangunan kota melalui manajemen rantai pasok publik yang modern, mengedepankan prinsip transparansi mutlak dalam setiap tahapan tender dan seleksi.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl md:p-8">
          <h3 className="text-primary font-bold text-xl mb-4">Landasan Hukum</h3>
          <p className="text-sm leading-6 text-on-surface-variant">
            Pelaksanaan fungsi BPBJ mengacu pada Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021 dan Peraturan Presiden Nomor 46 Tahun 2025, beserta peraturan pelaksana LKPP serta ketentuan organisasi perangkat daerah Kota Semarang yang berlaku.
          </p>
          <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Dasar Regulasi</p>
              <p className="mt-1 text-xs text-on-surface-variant">Perpres, Peraturan LKPP, dan ketentuan daerah.</p>
            </div>
            <span className="material-symbols-outlined text-6xl text-primary/15 select-none">account_balance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
