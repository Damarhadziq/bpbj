import { NEWS_CATEGORIES, NEWS_CATEGORY_ALL } from '../../constants/categories';
import CustomSelect from '../ui/CustomSelect';

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
    <section className="mb-10 rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau isi berita..." 
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="w-full lg:w-52">
          <CustomSelect
            value={sortOrder}
            onChange={setSortOrder}
            icon="tune"
            options={['Terbaru', 'Terlama']}
            buttonClassName="rounded-md shadow-none"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
              categoryFilter === cat 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
