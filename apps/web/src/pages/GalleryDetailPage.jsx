import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGalleryDetail } from '../hooks/useGallery';

export default function GalleryDetailPage() {
  const { id } = useParams();
  const { data: item, isLoading } = useGalleryDetail(id);
  const [focusedImageIndex, setFocusedImageIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (focusedImageIndex === null) return undefined;

    const scrollY = window.scrollY;
    const originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.position = originalStyles.position;
      document.body.style.top = originalStyles.top;
      document.body.style.width = originalStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [focusedImageIndex]);

  if (isLoading) {
    return (
      <main className="flex-grow pt-32 pb-16 w-full text-center">
        <p className="text-on-surface-variant">Memuat galeri...</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="flex-grow pt-32 pb-16 w-full">
        <div className="px-6 max-w-7xl mx-auto w-full text-center">
          <h1 className="text-3xl font-bold text-on-surface mb-4">Galeri Tidak Ditemukan</h1>
          <Link to="/gallery" className="text-primary hover:underline">Kembali ke Galeri</Link>
        </div>
      </main>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  const images = Array.isArray(item.galleryImages) && item.galleryImages.length > 0
    ? item.galleryImages
    : item.imageUrl
      ? [{ imageUrl: item.imageUrl, imageAlt: item.imageAlt || item.title, isCover: true }]
      : [];
  const coverImage = images.find((image) => image.isCover) || images[0];
  const previewImages = images.length > 4 ? images.slice(0, 4) : images;
  const remainingImages = Math.max(images.length - 4, 0);
  const focusedImage = focusedImageIndex !== null ? images[focusedImageIndex] : null;

  const openLightbox = (index) => {
    setFocusedImageIndex(index);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setFocusedImageIndex(null);
    setIsZoomed(false);
  };
  const showPreviousImage = () => {
    setIsZoomed(false);
    setFocusedImageIndex((currentIndex) => currentIndex === null ? null : (currentIndex - 1 + images.length) % images.length);
  };
  const showNextImage = () => {
    setIsZoomed(false);
    setFocusedImageIndex((currentIndex) => currentIndex === null ? null : (currentIndex + 1) % images.length);
  };
  const toggleZoom = () => setIsZoomed((currentValue) => !currentValue);
  const handleImagePointerUp = (event) => {
    if (event.pointerType !== 'touch') return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      toggleZoom();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
  };

  return (
    <main className="flex-grow pt-32 pb-16 w-full">
      <div className="px-6 max-w-5xl mx-auto w-full">
        <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline mb-8">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Galeri
        </Link>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-tighter">
            <span className="bg-surface-container-highest px-3 py-1 rounded">{item.category}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {formatDate(item.date)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight mb-4">{item.title}</h1>
          {item.location && (
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="material-symbols-outlined text-lg">location_on</span>
              <span>{item.location}</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl overflow-hidden bg-surface-container-low mb-10 shadow-sm border border-outline-variant/20">
          <img
            alt={coverImage?.imageAlt || item.imageAlt || item.title}
            className="w-full h-auto object-cover max-h-[70vh]"
            src={coverImage?.imageUrl || item.imageUrl || 'https://via.placeholder.com/1200x800'}
          />
        </div>

        <div className="prose prose-lg prose-slate dark:prose-invert max-w-3xl">
          <p className="text-lg md:text-xl font-medium text-on-surface-variant leading-relaxed">
            {item.description}
          </p>
        </div>

        {images.length > 1 && (
          <div className="mt-10 max-w-4xl">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {previewImages.map((image, index) => {
              const isMoreTile = remainingImages > 0 && index === previewImages.length - 1;

              return (
              <button
                type="button"
                onClick={() => openLightbox(index)}
                key={`${image.imageUrl}-${index}`}
                className="group relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={image.imageUrl}
                  alt={image.imageAlt || item.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {isMoreTile && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-2xl font-extrabold text-white backdrop-blur-[1px]">
                    +{remainingImages} foto
                  </span>
                )}
              </button>
              );
            })}
            </div>
          </div>
        )}
      </div>

      {focusedImage && (
        <div className="fixed inset-0 z-50 overflow-hidden overscroll-none bg-black/90 px-4 py-5 md:px-8" role="dialog" aria-modal="true" aria-label="Pratinjau foto galeri">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-4 text-white">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{focusedImage.imageAlt || item.title}</p>
                <p className="text-xs text-white/60">{focusedImageIndex + 1} dari {images.length}{isZoomed ? ' - diperbesar' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleZoom}
                  className="hidden rounded-full p-2 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white md:inline-flex"
                  aria-label={isZoomed ? 'Perkecil foto' : 'Perbesar foto'}
                >
                  <span className="material-symbols-outlined">{isZoomed ? 'zoom_out' : 'zoom_in'}</span>
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Tutup pratinjau"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className={`relative flex min-h-0 flex-1 overscroll-contain ${isZoomed ? 'items-start justify-start overflow-auto rounded-xl' : 'items-center justify-center overflow-hidden'}`}>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-0 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:left-3"
                  aria-label="Foto sebelumnya"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
              )}
              <img
                src={focusedImage.imageUrl}
                alt={focusedImage.imageAlt || item.title}
                onDoubleClick={toggleZoom}
                onPointerUp={handleImagePointerUp}
                className={`rounded-xl object-contain shadow-2xl select-none ${isZoomed ? 'h-auto w-[150vw] max-w-none cursor-zoom-out md:w-[120vw]' : 'max-h-full max-w-full cursor-zoom-in'}`}
                draggable={false}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-0 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:right-3"
                  aria-label="Foto berikutnya"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image.imageUrl}-thumb-${index}`}
                    onClick={() => openLightbox(index)}
                    className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition ${index === focusedImageIndex ? 'border-white opacity-100' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                    aria-label={`Buka foto ${index + 1}`}
                  >
                    <img src={image.imageUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
