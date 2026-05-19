import HeroSection from '../components/HeroSection';
import WelcomeSection from '../components/WelcomeSection';
import PrinciplesSection from '../components/PrinciplesSection';
import NewsSection from '../components/NewsSection';
import GallerySection from '../components/GallerySection';
import HelpdeskSection from '../components/HelpdeskSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WelcomeSection />
      <PrinciplesSection />
      <NewsSection />
      <GallerySection />
      <HelpdeskSection />
    </main>
  );
}
