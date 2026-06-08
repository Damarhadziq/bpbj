import { Link } from 'react-router-dom';
import { getNewsCategory } from '../../constants/categories';

export default function FeaturedNews({ newsData = [] }) {
  if (newsData.length === 0) return null;

  const featuredArticle = newsData.find(item => item.isFeatured) || newsData[0];
  const sidebarArticles = newsData.filter(item => item.isSelected && item.id !== featuredArticle.id).slice(0, 5);
  const featuredCategory = getNewsCategory(featuredArticle.category);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <section className="mb-12 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <Link to={`/news/${featuredArticle.id}`} className="group block">
          <div className="aspect-[16/10] overflow-hidden bg-slate-100">
            <img alt={featuredArticle.category} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={featuredArticle.imageUrl || 'https://via.placeholder.com/800x450'}/>
          </div>
          <div className="p-6 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-md bg-primary px-2.5 py-1 text-white">Sorotan</span>
              <span className="text-slate-500">{formatDate(featuredArticle.date)}</span>
              {featuredCategory && <span className="text-primary/80">{featuredCategory}</span>}
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-primary md:text-3xl">{featuredArticle.title}</h2>
            {featuredArticle.summary && <p className="mt-4 line-clamp-3 text-sm font-medium leading-7 text-slate-600">{featuredArticle.summary}</p>}
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase text-primary transition-all group-hover:gap-3">
              Baca Selengkapnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </Link>

        <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Berita Pilihan</p>
          </div>
          {sidebarArticles.length > 0 ? sidebarArticles.map(article => (
            <Link to={`/news/${article.id}`} key={article.id} className="group grid grid-cols-[88px_1fr] gap-3 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[112px_1fr] sm:gap-4 sm:p-5">
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                <img alt={article.category} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={article.imageUrl || 'https://via.placeholder.com/400x300'}/>
              </div>
              <div className="min-w-0">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-primary/80">{getNewsCategory(article.category)}</span>
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary">{article.title}</h3>
              </div>
            </Link>
          )) : (
            <div className="p-5 text-sm font-medium leading-6 text-slate-500">Belum ada berita pilihan. Tandai maksimal 5 berita dari admin.</div>
          )}
        </div>
      </div>
    </section>
  );
}
