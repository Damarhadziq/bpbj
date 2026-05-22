import { GALLERY_CATEGORIES, GALLERY_CATEGORY_ALL } from '../../constants/categories';

export default function GalleryFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  categories = [GALLERY_CATEGORY_ALL, ...GALLERY_CATEGORIES],
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 py-4 border-t border-outline-variant/20">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-2 font-medium rounded-full text-sm transition-colors ${
                categoryFilter === cat 
                  ? 'bg-primary text-on-primary font-bold' 
                  : 'bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64 flex-shrink-0">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..." 
            className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
    </section>
  );
}
