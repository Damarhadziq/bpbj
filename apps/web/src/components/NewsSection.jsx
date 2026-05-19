export default function NewsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4">Warta Pengadaan</h2>
            <p className="text-on-surface-variant max-w-xl">Informasi terkini seputar kebijakan, rilis tender, dan kegiatan Biro Pengadaan Barang dan Jasa Kota Semarang.</p>
          </div>
          <a className="group flex items-center gap-2 text-primary font-bold" href="#">
            Lihat Semua Berita
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs5BNG5lHD87QbfCeohzxRf4QodwMwyx0qXboPU6rFos1gI1UUry0s_5chl86erJEI66V8F4Sc4dzJ076U2kmrPJFbtRrqZ7_lwgXDqnhj2CnryE_ByL6X8Ni-JsiRn2lW9qi7YeWm4Oz0lE66ed9rydf9nrRWxL5bnLN6gsaXBiL63TqdYWi5Wxu2AlLbFljv324McEO9ydtWCQVv7WBhbbvyoCI4vRdIcUC0n4hCUpecN6QRNShtH2w04utm_mFJDbHIjLcJdg" 
                   alt="Professional business meeting in bright modern office"/>
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded">Utama</span>
              </div>
            </div>
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">12 Oktober 2024</span>
            <h3 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">Digitalisasi Pengadaan: BPBJ Kota Semarang Raih Penghargaan Inovasi Nasional</h3>
            <p className="text-on-surface-variant leading-relaxed">Implementasi sistem e-katalog lokal membawa Kota Semarang menjadi pionir dalam efisiensi belanja daerah yang transparan dan kompetitif...</p>
          </div>
          
          <div className="md:col-span-5 flex flex-col gap-8">
            <div className="flex gap-6 group cursor-pointer">
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDlE-4OAPuGq-LHaR2BiNCWUU5sGnpH2nJC-7cq5T9nUSgQaUVn3a1p8xQZzSMPfpDqe1pQXo9hFeS_s-lwmyzBu7jPb3K02RAYZb0yCtvvTSgIfLDNGwVv-rYOsqVSxjZQ1HZhUwO55fBWzIatMcc0c0nEajb7a6fdgfvP1CuYuoaQfCz-Hf-Al1nwSHfzEOYkOS_phcxJ-0NhrihbXmkSpchS-8FYSNxcx531oaYfFqSKPDzJKcQUonniRl3ww98hmQS1nS9kg" 
                     alt="Close up of a professional using a laptop"/>
              </div>
              <div>
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1 block">Kebijakan</span>
                <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">Sosialisasi Perpres Pengadaan Terbaru Bagi Pelaku UMKM Semarang</h4>
                <p className="text-xs text-on-surface-variant mt-2">8 Oktober 2024</p>
              </div>
            </div>

            <div className="flex gap-6 group cursor-pointer">
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuADFnzJbU3ovaF3Oi587kEzaj5O5ns2LQIc-DGppwFVah-GDXj5ueW1GWvT7ZydsVCN4INnqKWNTVI_sdazTobHmsrZm9yzt9HH6j9pdHJGoj8AyWv9qbxtJ3gGZTQ2VGxPQXDgAgIG3liqiiMrj4p-3hvJJd-nUXvHVfb4ZVFSf_zvlKc9S-itzWn2xuvWN2j6EVejjD9o614BZPLz408-oHckb3iE-LTUl99zHIEIZWqlNOEV-vHkuQ0mTAtexVooGnavxz5n2Q" 
                     alt="Modern office building glass facade"/>
              </div>
              <div>
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1 block">Tender</span>
                <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">Pembukaan Tender Konstruksi Jembatan Mberok Tahap II</h4>
                <p className="text-xs text-on-surface-variant mt-2">5 Oktober 2024</p>
              </div>
            </div>

            <div className="flex gap-6 group cursor-pointer">
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVQAABY-j1lBzx56-HfhjBYbxlSviRlwQLGAO-0loFJ0H8zvNpB9rpHuRG0ChbGOaabap82GDbuXQb7rjpTM-OmBsSvP1SAyKRNGkrxS8XWFI1ALzgHrbpcLfzQMnwRIfJt7gqE4YdkGDsdEEUCI6s_8oQ1InV0L3jxJfLkIkdXoqMNIzM8m2IOCbGhMJCRVY4IGbx0HyiWNnpSDaue2VJCv0yezzeMj3ye3lnxudHwIa45Jexdju6aiTTfy9hzMc9Tn2HYleLWg" 
                     alt="Group of diverse professionals shaking hands"/>
              </div>
              <div>
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1 block">Kegiatan</span>
                <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">Workshop Peningkatan Kapasitas Pejabat Pembuat Komitmen</h4>
                <p className="text-xs text-on-surface-variant mt-2">2 Oktober 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
