import { useState, useEffect, useCallback } from 'react';
import heroSlide1 from '../assets/hero_slide_1.png';
import { useCarousel } from '../hooks/useCarousel';

const defaultSlides = [
  {
    id: 1,
    image: heroSlide1,
    alt: 'Gedung pemerintahan modern di Kota Semarang',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1555761922-5fc6193a8a0c?w=1920&q=80&auto=format&fit=crop',
    alt: 'Panorama Kota Semarang dari udara',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop',
    alt: 'Suasana rapat pengadaan profesional',
  },
];

export default function HeroSection() {
  const { data: carouselItems = [] } = useCarousel();
  const slides = carouselItems
    .filter((item) => item.isActive)
    .map((item) => ({
      id: item.id,
      image: item.imageUrl,
      alt: item.imageAlt || 'Carousel image',
    }));
  const activeSlides = slides.length > 0 ? slides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % activeSlides.length);
  }, [activeSlides.length, currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length, currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  return (
    <section id="hero-section" className="relative w-full pt-32 pb-20 px-6 min-h-[90vh] flex items-center bg-surface overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Text */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary rounded text-sm font-bold tracking-widest uppercase mb-6 w-fit">
            Portal Resmi Pengadaan
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tighter leading-tight mb-6">
            Transformasi Pengadaan, <br/>
            <span className="text-primary">Mewujudkan Semarang Hebat</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Membangun integritas dan transparansi dalam setiap proses pengadaan barang dan jasa untuk kemajuan infrastruktur serta layanan publik Kota Semarang.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://spse.inaproc.id/nasional/lelang" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/20">
              Lihat Tender Aktif
            </a>
            <a href="https://sirup.inaproc.id/sirup/caripaketctr/index" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-transparent border-2 border-primary/20 text-primary font-bold rounded-lg hover:bg-primary/5 transition-all active:scale-95">
              Rencana Umum Pengadaan
            </a>
          </div>
        </div>

        {/* Right Side: Carousel */}
        <div className="order-1 lg:order-2 flex flex-col gap-4 relative">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10" style={{ aspectRatio: '16/9' }}>
            {/* Slides */}
            <div className="absolute inset-0 overflow-hidden">
              {activeSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={slide.image}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              ))}
            </div>

            {/* Slide Indicators inside carousel at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentSlide
                      ? 'w-6 h-2 bg-white shadow-sm'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Progress Bar inside carousel at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / activeSlides.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Arrows (below carousel) */}
          <div className="flex justify-end gap-3 px-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface flex items-center justify-center hover:bg-surface-variant transition-all duration-300 active:scale-90 group"
              aria-label="Slide sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface flex items-center justify-center hover:bg-surface-variant transition-all duration-300 active:scale-90 group"
              aria-label="Slide berikutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
