export default function TasksFunctionsSection() {
  return (
    <section className="scroll-mt-32" id="tugas-fungsi">
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-12 uppercase">Tugas &amp; Fungsi Pokok</h2>
      <div className="grid md:grid-cols-3 gap-1">
        <div className="md:col-span-2 bg-surface-container-low p-8 transition-colors hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-primary text-4xl mb-6">engineering</span>
          <h4 className="font-bold text-xl mb-4">Pengelolaan Pengadaan</h4>
          <p className="text-on-surface-variant leading-relaxed">Melaksanakan koordinasi, pembinaan, dan pengawasan terhadap seluruh tahapan pelaksanaan pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang.</p>
        </div>
        <div className="bg-surface-container-highest p-8 transition-colors">
          <span className="material-symbols-outlined text-primary text-4xl mb-6">monitoring</span>
          <h4 className="font-bold text-xl mb-4">Advokasi &amp; Monitoring</h4>
          <p className="text-on-surface-variant leading-relaxed">Memberikan pendampingan hukum dan teknis serta pemantauan evaluasi kinerja penyedia.</p>
        </div>
        <div className="bg-surface-container-highest p-8 transition-colors">
          <span className="material-symbols-outlined text-primary text-4xl mb-6">devices</span>
          <h4 className="font-bold text-xl mb-4">Layanan LPSE</h4>
          <p className="text-on-surface-variant leading-relaxed">Pengelolaan infrastruktur dan sistem informasi pengadaan secara elektronik.</p>
        </div>
        <div className="md:col-span-2 bg-surface-container-low p-8 transition-colors hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-primary text-4xl mb-6">verified_user</span>
          <h4 className="font-bold text-xl mb-4">Pembinaan SDM</h4>
          <p className="text-on-surface-variant leading-relaxed">Meningkatkan kapasitas personil melalui pelatihan berkelanjutan dan sertifikasi profesi pengadaan barang/jasa sesuai standar nasional.</p>
        </div>
      </div>
    </section>
  );
}
