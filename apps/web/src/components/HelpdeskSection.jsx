import { useServiceLinks } from '../hooks/useServiceLinks';

export default function HelpdeskSection() {
  const { data: links = [], isLoading } = useServiceLinks();

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-9 shadow-sm sm:px-10 lg:px-12">
            <div className="relative z-10">
              <div className="mb-6 h-9 w-72 animate-pulse rounded-lg bg-white/20" />
              <div className="mb-8 h-5 w-full max-w-2xl animate-pulse rounded bg-white/15" />
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-20 w-44 animate-pulse rounded-xl bg-white/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (links.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-9 shadow-sm sm:px-10 lg:px-12">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn78QGl11E-TJ1I6NMoSK9Ft7_60fpFhtYRqDEp1kEZVlqGVwIi3KX85ewmEA_KaP6zlcOd2HR3WO-ILm1tRoeEHc7mmYKphOUANIVDKP_ycFJ6_Sijx18LtRK9alkg61Snbr-VcwaOnG6svRVkHRrbcv0rOu3Ee9uXCfwOnBIOZCnBm9Ri8HcEtLhYb3PTqGZhcqc8IY6QObbOJlFW70d-3JOB-OH5NmzPmns3xZtLGW24xrt2grgVpRHPbZSb8Dx4vuwWVUzdw"
            alt=""
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-slate-950/60"></div>
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="relative z-10 max-w-4xl">
            <h2 className="mb-3 text-4xl font-black tracking-tighter text-white md:text-5xl">Layanan Lainnya</h2>
            <p className="mb-7 max-w-2xl text-lg leading-relaxed text-white/90">
              Akses cepat ke berbagai platform resmi dan layanan terkait pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang.
            </p>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/35 bg-white px-6 py-4 shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                >
                  <img
                    src={link.imageUrl}
                    alt=""
                    className="h-10 w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
