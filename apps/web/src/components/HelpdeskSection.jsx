export default function HelpdeskSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 shadow-sm sm:px-10 lg:px-12">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn78QGl11E-TJ1I6NMoSK9Ft7_60fpFhtYRqDEp1kEZVlqGVwIi3KX85ewmEA_KaP6zlcOd2HR3WO-ILm1tRoeEHc7mmYKphOUANIVDKP_ycFJ6_Sijx18LtRK9alkg61Snbr-VcwaOnG6svRVkHRrbcv0rOu3Ee9uXCfwOnBIOZCnBm9Ri8HcEtLhYb3PTqGZhcqc8IY6QObbOJlFW70d-3JOB-OH5NmzPmns3xZtLGW24xrt2grgVpRHPbZSb8Dx4vuwWVUzdw"
            alt=""
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-slate-950/60"></div>
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-white md:text-5xl">Layanan Lainnya</h2>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90">
              Akses cepat ke berbagai platform resmi dan layanan terkait pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://bantuan.inaproc.id/hc/id-id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-bold text-primary shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:shadow-xl">
                <span className="material-symbols-outlined">support_agent</span>
                Layanan Pengaduan
              </a>
              <a href="https://spse.inaproc.id/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/15 px-6 py-4 font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/25">
                <span className="material-symbols-outlined">public</span>
                SPSE
              </a>
              <a href="https://katalog.inaproc.id/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/15 px-6 py-4 font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/25">
                <span className="material-symbols-outlined">storefront</span>
                E-Katalog
              </a>
              <a href="http://siraka.dev.semarangkota.go.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/15 px-6 py-4 font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/25">
                <span className="material-symbols-outlined">dashboard</span>
                Siraka
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
