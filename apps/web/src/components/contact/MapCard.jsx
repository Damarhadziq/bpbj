export default function MapCard() {
  return (
    <div className="bg-surface-container-low overflow-hidden shadow-sm h-80 relative">
      <img className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-500" data-alt="Abstract stylized map of an urban city center with red location pins and clean typography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuWoBxaViQ9ujbniLSLHxNd4TYMjLzE6bb1ma2Ku6zzDJdYXcPoBy8iCge27e01kL5COnO1rItX7qUv5reNt1Pb2Q3X75LAlgiJd3witOkEVWi6Y1Et8mRDR9r5QFS63kHtyMO1bN8FDN4DIyIS-j89JeFtW_uLtDfQRsaEz6siy0RwEysUqEp-W0Lfe3lo5raRMv5DDXdqMe7H1pTmlUfxHonbu7PNZtEC7UI05dwQjoMyV6A1tPzeU27WXZe4CZvIIE_b7jbBg"/>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-lg">Lihat di Google Maps</div>
      </div>
    </div>
  );
}
