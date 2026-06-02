import { Link } from 'react-router-dom';
import { getNewsCategory } from '../../constants/categories';

export default function NewsGrid({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-10 text-on-surface-variant">
        Tidak ada berita yang ditemukan.
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="mb-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link to={`/news/${article.id}`} key={article.id} className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-primary/30">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img alt={article.category} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={article.imageUrl || 'https://via.placeholder.com/400x250'}/>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-500">{formatDate(article.date)}</span>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-primary/80">{getNewsCategory(article.category)}</span>
            </div>
            <h4 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-primary">{article.title}</h4>
            {article.summary && <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-600">{article.summary}</p>}
            <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-bold uppercase text-primary transition-all group-hover:gap-3">
              Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
