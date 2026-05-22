import { useState } from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryFilters from '../components/gallery/GalleryFilters';
import GalleryGrid from '../components/gallery/GalleryGrid';
import Pagination from '../components/news/Pagination';
import { useGallery } from '../hooks/useGallery';
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_ALL, galleryCategoryMatches, getGalleryCategory } from '../constants/categories';

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(GALLERY_CATEGORY_ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: galleryData = [], isLoading } = useGallery();

  const categories = [
    GALLERY_CATEGORY_ALL,
    ...GALLERY_CATEGORIES,
    ...Array.from(new Set(galleryData.map((item) => getGalleryCategory(item.category))))
      .filter((category) => category && !GALLERY_CATEGORIES.includes(category)),
  ];

  if (isLoading) {
    return (
      <main className="flex-grow pb-16 w-full flex items-center justify-center min-h-[50vh]">
        <p className="text-on-surface-variant">Memuat galeri...</p>
      </main>
    );
  }

  const filteredGallery = galleryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = galleryCategoryMatches(item.category, categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage) || 1;
  const paginatedGallery = filteredGallery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="flex-grow pb-16 w-full">
      <GalleryHero />
      <GalleryFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter} 
        setCategoryFilter={(val) => { setCategoryFilter(val); setCurrentPage(1); }} 
        categories={categories}
      />
      <GalleryGrid items={paginatedGallery} />
      
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}

      {/* FAB for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
    </main>
  );
}
