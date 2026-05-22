import { useParams, Link } from 'react-router-dom';
import { useNewsDetail } from '../hooks/useNews';
import { getNewsCategory } from '../constants/categories';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { data: article, isLoading } = useNewsDetail(id);

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
        <Link to="/news" className="text-primary hover:underline">Kembali ke Berita</Link>
      </main>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  const articleCategory = getNewsCategory(article.category);

  return (
    <main className="pt-32 flex-grow px-6 max-w-4xl mx-auto w-full pb-10">
      <Link to="/news" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Kembali ke Berita
      </Link>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-tighter">
          <span className="bg-surface-container-highest px-3 py-1 rounded">{formatDate(article.date)}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
          <span className="text-primary">{articleCategory}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight mb-6">{article.title}</h1>
      </div>

      <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-surface-container-low mb-10">
        <img alt={article.category} className="w-full h-full object-cover" src={article.imageUrl || 'https://via.placeholder.com/1200x500'}/>
      </div>

      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
        <p className="text-base text-on-surface leading-relaxed whitespace-pre-wrap">
          {article.content}
        </p>
      </div>
    </main>
  );
}
