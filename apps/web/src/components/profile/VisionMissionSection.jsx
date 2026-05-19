export default function VisionMissionSection() {
  return (
    <section className="scroll-mt-32" id="visi-misi">
      <div className="bg-primary-container p-12 rounded-2xl text-white relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 relative z-10">
          <div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-4">Visi</h3>
            <p className="text-3xl font-bold leading-tight tracking-tighter italic">
              "Menjadi Pusat Keunggulan Pengadaan Barang/Jasa Pemerintah yang Profesional dan Berintegritas di Indonesia."
            </p>
          </div>
          <div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-4">Misi</h3>
            <ul className="space-y-4 text-white/90">
              <li className="flex gap-4">
                <span className="flex-none w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>Meningkatkan kualitas SDM pengadaan yang bersertifikat dan kompeten.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>Mewujudkan tata kelola pengadaan secara elektronik yang aman dan transparan.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>Mengoptimalkan penggunaan produk dalam negeri melalui e-katalog lokal.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
