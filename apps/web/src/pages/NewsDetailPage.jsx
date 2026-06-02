import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNewsDetail } from '../hooks/useNews';
import { getNewsCategory } from '../constants/categories';
import SEOHead from '../components/SEOHead';
import { generateArticleSchema, generateBreadcrumbSchema } from '../utils/seoConfig';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { data: article, isLoading } = useNewsDetail(id);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

  const getArticleParagraphs = (content = '') => {
    const normalized = content.replace(/\r\n/g, '\n').trim();
    if (!normalized) return [];

    const blankLineParagraphs = normalized
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean);

    if (blankLineParagraphs.length > 1) return blankLineParagraphs;

    return normalized
      .split('\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    if (!isImageOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsImageOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageOpen]);

  const openImageLightbox = () => {
    setImageZoom(1);
    setIsImageOpen(true);
  };

  const zoomIn = () => setImageZoom((zoom) => Math.min(zoom + 0.25, 3));
  const zoomOut = () => setImageZoom((zoom) => Math.max(zoom - 0.25, 0.5));
  const resetZoom = () => setImageZoom(1);

  if (isLoading) {
    return (
      <main className="pt-32 flex-grow px-6 max-w-7xl mx-auto w-full pb-20 text-center">
        <p className="text-on-surface-variant">Memuat berita...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-32 flex-grow px-6 max-w-7xl mx-auto w-full pb-20 text-center">
        <h1 className="text-3xl font-bold text-on-surface mb-4">Berita Tidak Ditemukan</h1>
        <Link to="/news" className="font-medium text-primary transition-colors hover:text-primary/80">Kembali ke Berita</Link>
      </main>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  const articleCategory = getNewsCategory(article.category);
  const paragraphs = getArticleParagraphs(article.content);
  const imageSrc = article.imageUrl || 'https://via.placeholder.com/1200x500';
  const description = article.summary || paragraphs[0]?.slice(0, 155) || article.title;

  return (
    <>
      <SEOHead
        title={`${article.title} | BPBJ Kota Semarang`}
        description={description}
        path={`/news/${article.id}`}
        image={imageSrc}
        type="article"
        schemas={[
          generateArticleSchema(article),
          generateBreadcrumbSchema([
            { name: 'Beranda', url: '/' },
            { name: 'Berita', url: '/news' },
            { name: article.title, url: `/news/${article.id}` },
          ]),
        ]}
      />
      <main className="pt-32 flex-grow px-5 sm:px-6 max-w-5xl mx-auto w-full pb-20">
        <Link to="/news" className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-0.5">arrow_back</span>
          Kembali ke Berita
        </Link>
        
        <header className="mb-8">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase text-on-surface-variant">
            <span className="rounded-full bg-surface-container-highest px-3 py-1.5">{formatDate(article.date)}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-surface-variant"></span>
            <span className="text-primary">{articleCategory}</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-on-surface sm:text-4xl md:text-5xl">{article.title}</h1>
        </header>

        <button
          type="button"
          onClick={openImageLightbox}
          className="group relative mb-12 block w-full overflow-hidden rounded-2xl bg-surface-container-low text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20"
          aria-label="Lihat foto berita ukuran penuh"
        >
          <img alt={article.title} className="h-auto max-h-[520px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={imageSrc}/>
          <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/65 px-4 py-2 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="material-symbols-outlined text-base">zoom_in</span>
            Lihat foto
          </span>
        </button>

        <article className="text-[17px] leading-8 text-slate-800 sm:text-lg sm:leading-9">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6 last:mb-0">
              {paragraph}
            </p>
          ))}
        </article>
      </main>

      {isImageOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 text-white" role="dialog" aria-modal="true" aria-label="Preview foto berita">
          <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              {Math.round(imageZoom * 100)}%
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur-md">
              <button type="button" onClick={zoomOut} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15" aria-label="Perkecil foto">
                <span className="material-symbols-outlined">zoom_out</span>
              </button>
              <button type="button" onClick={resetZoom} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15" aria-label="Reset zoom">
                <span className="material-symbols-outlined">fit_screen</span>
              </button>
              <button type="button" onClick={zoomIn} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15" aria-label="Perbesar foto">
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
              <button type="button" onClick={() => setIsImageOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15" aria-label="Tutup preview foto">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className="h-full w-full overflow-auto px-4 pb-8 pt-24">
            <div className="flex min-h-full items-center justify-center">
              <img
                src={imageSrc}
                alt={article.title}
                className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl transition-transform duration-200"
                style={{ transform: `scale(${imageZoom})` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
