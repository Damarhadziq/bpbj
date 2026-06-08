const coreFunctions = [
  {
    icon: 'account_tree',
    title: 'Perencanaan & Koordinasi',
    description: 'Merencanakan program, kegiatan, anggaran, serta melaksanakan koordinasi dengan perangkat daerah dan pihak terkait dalam penyelenggaraan pengadaan barang/jasa.'
  },
  {
    icon: 'fact_check',
    title: 'Pengelolaan Pengadaan',
    description: 'Menyiapkan inventarisasi paket, riset dan analisis pasar, strategi pengadaan, pemilihan penyedia, katalog elektronik lokal/sektoral, serta pengelolaan kontrak.'
  },
  {
    icon: 'dns',
    title: 'Layanan Pengadaan Elektronik',
    description: 'Mengelola sistem informasi pengadaan barang/jasa beserta infrastrukturnya, termasuk layanan, registrasi, verifikasi, pengembangan, pengamanan, dan informasi publik.'
  },
  {
    icon: 'support_agent',
    title: 'Pembinaan & Advokasi',
    description: 'Melaksanakan pembinaan pelaku pengadaan, pengelolaan pengetahuan, bimbingan teknis, pendampingan, konsultasi, dan layanan penyelesaian sengketa kontrak.'
  }
];

export default function TasksFunctionsSection() {
  return (
    <section className="scroll-mt-32" id="tugas-fungsi">
      <h2 className="mb-7 text-2xl font-bold uppercase tracking-tight text-on-surface md:mb-12 md:text-3xl md:font-extrabold">Tugas Pokok &amp; Fungsi</h2>

      <div className="grid gap-3 md:grid-cols-3 md:gap-1">
        <div className="bg-surface-container-low p-5 transition-colors duration-300 ease-out hover:bg-surface-container-high md:col-span-3 md:p-8">
          <span className="material-symbols-outlined mb-4 text-3xl text-primary md:mb-6 md:text-4xl">workspaces</span>
          <h4 className="mb-3 text-lg font-bold md:mb-4 md:text-xl">Tugas Pokok</h4>
          <p className="max-w-4xl leading-relaxed text-on-surface-variant">
            Bagian Pengadaan Barang/Jasa mempunyai tugas merencanakan, mengkoordinasikan, membina, mengawasi, mengendalikan, dan mengevaluasi tugas Subbagian Pengelolaan Pengadaan Barang/Jasa, Layanan Pengadaan Secara Elektronik, serta Pembinaan dan Advokasi Pengadaan Barang/Jasa.
          </p>
        </div>

        {coreFunctions.map((item, index) => (
          <div
            key={item.title}
            className={`bg-surface-container-low p-5 transition-colors duration-300 ease-out hover:bg-surface-container-high md:p-8 ${index === 3 ? 'md:col-span-3' : ''}`}
          >
            <span className="material-symbols-outlined mb-4 text-3xl text-primary md:mb-6 md:text-4xl">{item.icon}</span>
            <h4 className="mb-3 text-lg font-bold md:mb-4 md:text-xl">{item.title}</h4>
            <p className="leading-relaxed text-on-surface-variant">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
