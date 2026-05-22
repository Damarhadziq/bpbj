import { NEWS_CATEGORIES, NEWS_CATEGORY_ALL } from '../../constants/categories';

export default function NewsFilters({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  categories = [NEWS_CATEGORY_ALL, ...NEWS_CATEGORIES],
}) {
  return (
    <section className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
              categoryFilter === cat 
                ? 'bg-primary text-on-primary font-bold' 
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita..." 
            className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div className="relative w-full md:w-48">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">tune</span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none bg-surface-container-low border-none rounded-lg pl-12 pr-10 py-3 text-sm font-medium focus:ring-2 focus:ring-primary w-full outline-none"
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
          </select>
        </div>
      </div>
    </section>
  );
}
