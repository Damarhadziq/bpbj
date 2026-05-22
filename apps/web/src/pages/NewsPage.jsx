import { useState } from 'react';
import NewsHero from '../components/news/NewsHero';
import NewsFilters from '../components/news/NewsFilters';
import FeaturedNews from '../components/news/FeaturedNews';
import NewsGrid from '../components/news/NewsGrid';
import Pagination from '../components/news/Pagination';
import { useNews } from '../hooks/useNews';
import { NEWS_CATEGORIES, NEWS_CATEGORY_ALL, newsCategoryMatches } from '../constants/categories';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(NEWS_CATEGORY_ALL);
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { data: newsData = [], isLoading } = useNews();

  const categories = [
    NEWS_CATEGORY_ALL,
    ...NEWS_CATEGORIES,
  ];

  if (isLoading) {
    return (
      <main className="flex-grow pb-16 w-full flex items-center justify-center min-h-[50vh]">
        <p className="text-on-surface-variant">Memuat berita...</p>
      </main>
    );
  }

  // Filter logic
  let filteredNews = newsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = newsCategoryMatches(item.category, categoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  filteredNews = filteredNews.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (sortOrder === 'Terlama') {
      return dateA - dateB;
    }
    // Terbaru
    return dateB - dateA;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="flex-grow pb-16 w-full">
      <div className="px-6 max-w-7xl mx-auto w-full">
        <NewsHero />
        <NewsFilters 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          categoryFilter={categoryFilter} 
          setCategoryFilter={(val) => { setCategoryFilter(val); setCurrentPage(1); }} 
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categories}
        />
        {searchQuery === '' && categoryFilter === NEWS_CATEGORY_ALL && currentPage === 1 && newsData.length > 0 && (
          <FeaturedNews newsData={newsData} />
        )}
        <NewsGrid articles={paginatedNews} />
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
    </main>
  );
}
