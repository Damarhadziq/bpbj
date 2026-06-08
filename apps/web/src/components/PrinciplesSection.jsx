export default function PrinciplesSection() {
  return (
    <section className="py-14 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          
          <div className="group">
            <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
              <div className="hidden w-12 h-1 px-0 bg-primary md:block"></div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Prinsip Utama 01</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight md:text-3xl md:mb-4">Transparan</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Akses terbuka bagi publik untuk memantau setiap tahapan pengadaan secara real-time melalui sistem digital terpadu.
            </p>
          </div>

          <div className="group">
            <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
              <div className="hidden w-12 h-1 px-0 bg-primary md:block"></div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Prinsip Utama 02</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight md:text-3xl md:mb-4">Profesional</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Dikelola oleh SDM kompeten dan bersertifikasi yang menjunjung tinggi etika kerja dan standar operasional prosedur.
            </p>
          </div>

          <div className="group">
            <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
              <div className="hidden w-12 h-1 px-0 bg-primary md:block"></div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Prinsip Utama 03</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight md:text-3xl md:mb-4">Akuntabel</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Setiap keputusan dan penggunaan anggaran dapat dipertanggungjawabkan sesuai dengan peraturan perundang-undangan yang berlaku.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
