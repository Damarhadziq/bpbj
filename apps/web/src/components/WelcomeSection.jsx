import bpbjHead from '../assets/bpbj_head.png';
import { useWelcomeMessage } from '../hooks/useWelcome';

export default function WelcomeSection() {
  const { data: welcomeData } = useWelcomeMessage();

  // Fallback content if database is empty
  const defaultMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nPuji syukur kita panjatkan ke hadirat Allah SWT yang telah memberikan rahmat dan hidayah-Nya sehingga portal resmi Badan Pengadaan Barang dan Jasa (BPBJ) Kota Semarang dapat hadir untuk melayani masyarakat dengan lebih baik.\n\nPortal ini merupakan wujud komitmen kami dalam mewujudkan transparansi, akuntabilitas, dan efisiensi dalam setiap proses pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang. Melalui platform ini, kami berharap dapat memberikan akses informasi yang mudah, cepat, dan terpercaya kepada seluruh pemangku kepentingan.\n\nKami mengajak seluruh pihak untuk bersama-sama mendukung tata kelola pengadaan yang bersih, profesional, dan berintegritas demi kemajuan Kota Semarang yang kita cintai.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`;

  const name = welcomeData?.name || "Drs. H. Ahmad Syafrudin, M.Si.";
  const position = welcomeData?.position || "Kepala BPBJ Kota Semarang";
  const message = welcomeData?.message || defaultMessage;
  const imageUrl = welcomeData?.imageUrl || bpbjHead;

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
            Sambutan Kepala
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
                  src={imageUrl}
                  alt={position}
                  className="w-full aspect-[3/4] object-cover object-top"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Name card overlapping the photo */}
              <div className="relative -mt-20 mx-4 rounded-xl bg-white p-5 text-center shadow-xl">
                <h3 className="text-xl font-bold text-on-surface tracking-tight leading-snug">
                  {name}
                </h3>
                <p className="mt-1.5 text-base font-medium leading-snug text-on-surface-variant">
                  {position}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Welcome Message */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {/* Large quote mark */}
              <svg className="absolute -top-8 -left-4 w-16 h-16 text-primary/10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
              </svg>

              <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-6 leading-tight">
                Selamat Datang di Portal <br className="hidden md:block" />
                <span className="text-primary">BPBJ Kota Semarang</span>
              </h2>

              <div className="space-y-5 text-on-surface-variant text-base md:text-lg leading-relaxed whitespace-pre-line">
                {message}
              </div>

              {/* Signature line */}
              <div className="mt-8 pt-6 border-t border-outline-variant/40 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-primary rounded-full" />
                <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                  {position}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
