import { useParams, Link } from 'react-router-dom';
import { useGalleryDetail } from '../hooks/useGallery';

export default function GalleryDetailPage() {
  const { id } = useParams();
  const { data: item, isLoading } = useGalleryDetail(id);

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

  return (
    <main className="flex-grow pt-32 pb-16 w-full">
      <div className="px-6 max-w-4xl mx-auto w-full">
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
          <img alt={item.imageAlt || item.title} className="w-full h-auto object-cover max-h-[70vh]" src={item.imageUrl || 'https://via.placeholder.com/1200x800'}/>
        </div>

        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="text-xl font-medium text-on-surface-variant leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </main>
  );
}
