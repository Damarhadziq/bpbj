import bpbjHead from '../assets/bpbj_head.png';

export default function WelcomeSection() {
  return (
    <section id="welcome-section" className="relative py-20 md:py-28 bg-surface overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-tertiary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-14">
          <div className="w-12 h-1 bg-primary" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            Sambutan Kepala BPBJ
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Photo + Name Card */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative mx-auto lg:mx-0" style={{ maxWidth: '340px' }}>
              {/* Decorative frame behind photo */}
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl -rotate-3" />
              <div className="absolute -inset-3 bg-gradient-to-tl from-tertiary/15 via-transparent to-transparent rounded-2xl rotate-2" />

              {/* Photo container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <img
                  src={bpbjHead}
                  alt="Kepala BPBJ Kota Semarang"
                  className="w-full aspect-[3/4] object-cover object-top"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Name card overlapping the photo */}
              <div className="relative -mt-20 mx-4 bg-white rounded-xl shadow-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <div className="w-10 h-0.5 bg-primary/30 rounded-full" />
                </div>
                <h3 className="text-lg font-bold text-on-surface tracking-tight leading-snug">
                  Drs. H. Ahmad Syafrudin, M.Si.
                </h3>
                <p className="text-sm text-on-surface-variant mt-1 font-medium">
                  Kepala BPBJ Kota Semarang
                </p>
              </div>
            </div>
          </div>

          {/* Right: Welcome Message */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {/* Large quote mark */}
              <svg className="absolute -top-8 -left-4 w-16 h-16 text-primary/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
              </svg>

              <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-6 leading-tight">
                Selamat Datang di Portal <br className="hidden md:block" />
                <span className="text-primary">BPBJ Kota Semarang</span>
              </h2>

              <div className="space-y-5 text-on-surface-variant text-base md:text-lg leading-relaxed">
                <p>
                  Assalamu'alaikum Warahmatullahi Wabarakatuh.
                </p>
                <p>
                  Puji syukur kita panjatkan ke hadirat Allah SWT yang telah memberikan rahmat dan hidayah-Nya sehingga portal resmi Badan Pengadaan Barang dan Jasa (BPBJ) Kota Semarang dapat hadir untuk melayani masyarakat dengan lebih baik.
                </p>
                <p>
                  Portal ini merupakan wujud komitmen kami dalam mewujudkan transparansi, akuntabilitas, dan efisiensi dalam setiap proses pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang. Melalui platform ini, kami berharap dapat memberikan akses informasi yang mudah, cepat, dan terpercaya kepada seluruh pemangku kepentingan.
                </p>
                <p>
                  Kami mengajak seluruh pihak untuk bersama-sama mendukung tata kelola pengadaan yang bersih, profesional, dan berintegritas demi kemajuan Kota Semarang yang kita cintai.
                </p>
                <p className="font-medium text-on-surface">
                  Wassalamu'alaikum Warahmatullahi Wabarakatuh.
                </p>
              </div>

              {/* Signature line */}
              <div className="mt-8 pt-6 border-t border-outline-variant/40 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-primary rounded-full" />
                <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                  Kepala BPBJ Kota Semarang
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
