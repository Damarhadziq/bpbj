export default function DocumentationRequest() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-20">
      <div className="bg-primary-container p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl font-black text-white leading-none mb-6">BUTUH DOKUMENTASI <br/>KHUSUS?</h2>
            <p className="text-white/80 text-lg">Permohonan akses arsip foto dan video kegiatan untuk keperluan media atau publikasi resmi dapat diajukan melalui portal layanan informasi kami.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button className="bg-white text-primary px-8 py-4 font-bold rounded-md hover:bg-surface-container-low transition-colors">AJUKAN PERMOHONAN</button>
            <button className="border-2 border-white/40 text-white px-8 py-4 font-bold rounded-md hover:bg-white/10 transition-colors">UNDUH PROFIL</button>
          </div>
        </div>
      </div>
    </section>
  );
}
