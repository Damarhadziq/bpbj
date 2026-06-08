import { Link } from 'react-router-dom';

export default function GalleryGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-on-surface-variant">
        Tidak ada galeri yang ditemukan.
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <Link to={`/gallery/${item.id}`} key={item.id} className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-primary/30">
            <div className="aspect-video overflow-hidden bg-surface-container-low relative">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.imageUrl || 'https://via.placeholder.com/600x400'} alt={item.imageAlt || item.title} />
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-tertiary-container text-white text-[10px] font-bold uppercase tracking-wider rounded">{item.category}</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow md:p-6">
              <h4 className="text-lg font-bold text-on-surface mb-3 leading-tight line-clamp-2 md:text-xl">{item.title}</h4>
              <p className="text-sm text-on-surface-variant mb-5 line-clamp-2 flex-grow md:mb-6">{item.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary transition-all group-hover:gap-3">
                  LIHAT DETAIL <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
