import { Link } from 'react-router-dom';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
      {articles.map((article) => (
        <Link to={`/news/${article.id}`} key={article.id} className="flex flex-col group cursor-pointer">
          <div className="aspect-video rounded-xl overflow-hidden bg-surface-container-low mb-5 relative">
            <img alt={article.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.imageUrl || 'https://via.placeholder.com/400x250'}/>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant mb-3 uppercase tracking-tighter">
            <span className="bg-surface-container-highest px-2 py-0.5 rounded">{formatDate(article.date)}</span>
            <span>{article.category}</span>
          </div>
          <h4 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">{article.title}</h4>
          <div className="mt-auto flex items-center gap-2 text-primary font-bold text-xs uppercase group-hover:gap-4 transition-all">
            Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
