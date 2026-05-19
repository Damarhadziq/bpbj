import GalleryHero from '../components/gallery/GalleryHero';
import GalleryFilters from '../components/gallery/GalleryFilters';
import GalleryGrid from '../components/gallery/GalleryGrid';
import DocumentationRequest from '../components/gallery/DocumentationRequest';

export default function GalleryPage() {
  return (
    <main className="flex-grow pt-24 pb-20">
      <GalleryHero />
      <GalleryFilters />
      <GalleryGrid />
      <DocumentationRequest />

      {/* FAB for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
    </main>
  );
}
