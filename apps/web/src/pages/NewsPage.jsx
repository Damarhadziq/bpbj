import { useState } from 'react';
import NewsHero from '../components/news/NewsHero';
import NewsFilters from '../components/news/NewsFilters';
import FeaturedNews from '../components/news/FeaturedNews';
import NewsGrid from '../components/news/NewsGrid';
import Pagination from '../components/news/Pagination';
import { useNews, useNewsCategories } from '../hooks/useNews';
import { NEWS_CATEGORIES, NEWS_CATEGORY_ALL, newsCategoryMatches } from '../constants/categories';
import SEOHead from '../components/SEOHead';
import { generateBreadcrumbSchema, pageSEO } from '../utils/seoConfig';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(NEWS_CATEGORY_ALL);
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { data: newsData = [], isLoading } = useNews();
  const { data: newsCategories = NEWS_CATEGORIES } = useNewsCategories();

  const categories = [
    NEWS_CATEGORY_ALL,
    ...newsCategories,
  ];
  const seoSchemas = [
    generateBreadcrumbSchema([
      { name: 'Beranda', url: '/' },
      { name: 'Berita', url: '/news' },
    ]),
  ];

  if (isLoading) {
    return (
      <main className="flex-grow pb-16 w-full flex items-center justify-center min-h-[50vh]">
        <SEOHead {...pageSEO.news} schemas={seoSchemas} />
        <h1 className="sr-only">Berita Pengadaan BPBJ Kota Semarang</h1>
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
    <main className="w-full flex-grow bg-slate-50 pb-20">
      <SEOHead
        {...pageSEO.news}
        schemas={seoSchemas}
      />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6">
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
        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">Daftar Berita</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Semua Berita</h2>
            </div>
          </div>
          <NewsGrid articles={paginatedNews} />
        </section>
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
