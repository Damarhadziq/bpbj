import { GALLERY_CATEGORIES, GALLERY_CATEGORY_ALL } from '../../constants/categories';

export default function GalleryFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  categories = [GALLERY_CATEGORY_ALL, ...GALLERY_CATEGORIES],
}) {
  return (
    <section className="mx-auto mb-8 max-w-7xl px-5 sm:px-6 md:mb-10">
      <div className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau lokasi galeri..."
              className="h-11 w-full rounded-md border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          </div>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3 pt-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
