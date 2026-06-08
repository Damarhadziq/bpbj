import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { getNewsCategory } from '../constants/categories';

export default function NewsSection() {
  const { data: newsData = [], isLoading } = useNews();

  if (isLoading) {
    return (
      <section className="py-24 bg-surface text-center">
        <p className="text-on-surface-variant">Memuat berita...</p>
      </section>
    );
  }

  if (newsData.length === 0) {
    return null; // Return empty or a message if no news
  }

  const featuredArticle = newsData.find(item => item.isFeatured) || newsData[0];
  const sideArticles = newsData.filter(item => !item.isFeatured && item.id !== featuredArticle.id).slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <section className="py-14 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="mb-9 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-3 md:text-4xl md:mb-4">Warta Pengadaan</h2>
            <p className="text-on-surface-variant max-w-xl">Informasi terkini seputar kebijakan, rilis tender, dan kegiatan Biro Pengadaan Barang dan Jasa Kota Semarang.</p>
          </div>
          <Link to="/news" className="group flex w-fit items-center gap-2 text-primary font-bold transition-all hover:gap-3">
            Lihat Semua Berita
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid gap-8 md:grid-cols-12">
          <Link to={`/news/${featuredArticle.id}`} className="md:col-span-7 group cursor-pointer block">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 md:mb-6">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   src={featuredArticle.imageUrl || 'https://via.placeholder.com/800x450'} 
                   alt={featuredArticle.category}/>
              {featuredArticle.isFeatured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded">Utama</span>
                </div>
              )}
            </div>
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">{formatDate(featuredArticle.date)}</span>
            <h3 className="text-2xl font-bold tracking-tight leading-snug group-hover:text-primary transition-colors md:text-3xl">{featuredArticle.title}</h3>
          </Link>
          
          <div className="md:col-span-5 flex flex-col gap-5 md:gap-8">
            {sideArticles.map(article => (
              <Link to={`/news/${article.id}`} key={article.id} className="flex gap-4 group cursor-pointer md:gap-6">
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container-low sm:h-32 sm:w-32">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       src={article.imageUrl || 'https://via.placeholder.com/400x400'} 
                       alt={article.category}/>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1 block">{getNewsCategory(article.category)}</span>
                  <h4 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">{article.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-2">{formatDate(article.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
