import HeroSection from '../components/HeroSection';
import WelcomeSection from '../components/WelcomeSection';
import PrinciplesSection from '../components/PrinciplesSection';
import NewsSection from '../components/NewsSection';
import GallerySection from '../components/GallerySection';
import HelpdeskSection from '../components/HelpdeskSection';
import SEOHead from '../components/SEOHead';
import { organizationSchema, pageSEO, websiteSchema } from '../utils/seoConfig';

export default function HomePage() {
  return (
    <main className="flex-grow w-full">
      <SEOHead {...pageSEO.home} schemas={[organizationSchema, websiteSchema]} />
      <HeroSection />
      <WelcomeSection />
      <PrinciplesSection />
      <NewsSection />
      <GallerySection />
      <HelpdeskSection />
    </main>
  );
}
