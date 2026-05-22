import { Link } from 'react-router-dom';
import { getNewsCategory } from '../../constants/categories';

export default function FeaturedNews({ newsData = [] }) {
  if (newsData.length === 0) return null;

  const featuredArticle = newsData.find(item => item.isFeatured) || newsData[0];
  const sidebarArticles = newsData.filter(item => !item.isFeatured && item.id !== featuredArticle.id).slice(0, 2);
  const featuredCategory = getNewsCategory(featuredArticle.category);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
      {/* Featured News (Large) */}
      <Link to={`/news/${featuredArticle.id}`} className="md:col-span-8 group cursor-pointer block">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low aspect-[16/9] mb-6">
          <img alt={featuredArticle.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={featuredArticle.imageUrl || 'https://via.placeholder.com/800x450'}/>
          {featuredArticle.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="px-4 py-1.5 bg-tertiary-container text-white text-[10px] font-black uppercase tracking-widest rounded-sm">PENGUMUMAN UTAMA</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-4 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            <span>{formatDate(featuredArticle.date)}</span>
            {featuredCategory && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                <span>{featuredCategory}</span>
              </>
            )}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface group-hover:text-primary transition-colors leading-tight">{featuredArticle.title}</h2>
        </div>
      </Link>

      {/* Sidebar News Items */}
      <div className="md:col-span-4 flex flex-col gap-8">
        {sidebarArticles.map(article => (
          <Link to={`/news/${article.id}`} key={article.id} className="group cursor-pointer block">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low mb-4">
              <img alt={article.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.imageUrl || 'https://via.placeholder.com/400x300'}/>
            </div>
            <span className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-2 block">{article.category}</span>
            <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
