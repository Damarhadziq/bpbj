export default function HelpdeskSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-primary-container rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
            <span className="material-symbols-outlined text-[300px] leading-none -rotate-12 translate-x-20 translate-y-20 text-white">shield_person</span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-6">Saluran Pengaduan & Bantuan</h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Menemukan ketidaksesuaian dalam proses pengadaan? Atau butuh bantuan teknis terkait LPSE? Tim kami siap membantu Anda melalui kanal komunikasi resmi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary px-8 py-4 font-bold rounded-xl flex items-center gap-3 active:scale-95 transition-all">
                <span className="material-symbols-outlined">support_agent</span>
                Layanan Pengaduan
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-8 py-4 font-bold rounded-xl flex items-center gap-3 backdrop-blur-md active:scale-95 transition-all">
                <span className="material-symbols-outlined">contact_support</span>
                Helpdesk LPSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
