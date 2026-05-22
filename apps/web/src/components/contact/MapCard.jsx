export default function MapCard() {
  return (
    <a href="https://maps.app.goo.gl/zupzBTqreRZhPiMv6?g_st=ac" target="_blank" rel="noopener noreferrer" className="block bg-surface-container-low overflow-hidden shadow-sm h-80 relative group">
      <iframe 
        src="https://maps.google.com/maps?q=Balai%20Kota%20Semarang&t=&z=15&ie=UTF8&iwloc=&output=embed" 
        className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-500 pointer-events-none" 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Peta Lokasi BPBJ Kota Semarang"
      ></iframe>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-transparent transition-colors duration-500">
        <div className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary shadow-xl rounded-full transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-2 pointer-events-auto cursor-pointer">
          <span className="material-symbols-outlined text-sm">directions</span>
          Buka di Google Maps
        </div>
      </div>
    </a>
  );
}
