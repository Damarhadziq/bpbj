export default function PrinciplesSection() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          
          <div className="group">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-1 px-0 bg-primary"></div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Prinsip Utama 01</span>
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Transparan</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Akses terbuka bagi publik untuk memantau setiap tahapan pengadaan secara real-time melalui sistem digital terpadu.
            </p>
          </div>

          <div className="group">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-1 px-0 bg-primary"></div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Prinsip Utama 02</span>
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Profesional</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Dikelola oleh SDM kompeten dan bersertifikasi yang menjunjung tinggi etika kerja dan standar operasional prosedur.
            </p>
          </div>

          <div className="group">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-1 px-0 bg-primary"></div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Prinsip Utama 03</span>
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Akuntabel</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Setiap keputusan dan penggunaan anggaran dapat dipertanggungjawabkan sesuai dengan peraturan perundang-undangan yang berlaku.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
