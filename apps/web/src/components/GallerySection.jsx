import { Link } from 'react-router-dom';
import { useGallery } from '../hooks/useGallery';

export default function GallerySection() {
  const { data: galleryData = [], isLoading } = useGallery();

  if (isLoading) {
    return (
      <section className="py-24 bg-surface-container-low overflow-hidden text-center">
        <p className="text-on-surface-variant">Memuat galeri...</p>
      </section>
    );
  }

  if (galleryData.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-4xl font-black tracking-tighter">Galeri Kegiatan</h2>
          <p className="text-on-surface-variant md:text-right max-w-md">Dokumentasi transparansi dan aksi nyata BPBJ Kota Semarang dalam melayani masyarakat.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryData.slice(0, 4).map((item, idx) => (
            <Link to={`/gallery/${item.id}`} key={item.id} className={`aspect-square rounded-xl overflow-hidden group relative block ${idx % 2 !== 0 ? 'md:mt-8' : ''}`}>
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   src={item.imageUrl || 'https://via.placeholder.com/600x600'} alt={item.imageAlt || item.title}/>
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <span className="material-symbols-outlined text-white text-3xl mb-2">open_in_new</span>
                <span className="text-white font-bold text-sm px-2 line-clamp-2">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
