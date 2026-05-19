import NewsHero from '../components/news/NewsHero';
import NewsFilters from '../components/news/NewsFilters';
import FeaturedNews from '../components/news/FeaturedNews';
import NewsGrid from '../components/news/NewsGrid';
import Pagination from '../components/news/Pagination';

export default function NewsPage() {
  return (
    <main className="mt-24 flex-grow px-6 max-w-7xl mx-auto w-full">
      <NewsHero />
      <NewsFilters />
      <FeaturedNews />
      <NewsGrid />
      <Pagination />
    </main>
  );
}
