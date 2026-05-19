export default function AboutSection() {
  return (
    <section className="scroll-mt-32" id="tentang-kami">
      <div className="inline-block bg-primary w-12 h-1 mb-6"></div>
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-8 uppercase">Tentang Kami</h2>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg">
          <p>
            Bagian Pengadaan Barang dan Jasa (BPBJ) Kota Semarang adalah unit kerja strategis di bawah Sekretariat Daerah yang berdedikasi untuk menciptakan ekosistem pengadaan yang bersih, efektif, dan akuntabel.
          </p>
          <p>
            Kami bertindak sebagai katalisator pembangunan kota melalui manajemen rantai pasok publik yang modern, mengedepankan prinsip transparansi mutlak dalam setiap tahapan tender dan seleksi.
          </p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-surface-variant/40 select-none">account_balance</span>
          <h3 className="text-primary font-bold text-xl mb-4">Landasan Hukum</h3>
          <p className="text-sm text-on-surface-variant">BPBJ Kota Semarang beroperasi berdasarkan Peraturan Walikota Semarang Nomor 83 Tahun 2016 tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi serta Tata Kerja Sekretariat Daerah Kota Semarang.</p>
        </div>
      </div>
    </section>
  );
}
