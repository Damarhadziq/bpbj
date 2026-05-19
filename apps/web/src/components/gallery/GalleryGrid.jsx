export default function GalleryGrid() {
  const cards = [
    {
      type: "featured",
      category: "Terbaru",
      title: "Rapat Koordinasi Persiapan E-Katalog Lokal 2024",
      date: "15 Oktober 2024",
      location: "Ruang Lokakrida, Balaikota",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7-P0mz2EHjdRDc7pvUsb9PxkWKFwLjCImh-9WXby15uxhOoS6FxyjJmAbqfQiHPamh4KAVErdL0tq-Sr_nfUdzcSKb9EB0IlkYIxEZKJ5vLZW73pnFD_VaHlh1amEpvKIKy9c-rK_iLzXA9AN7us_8KuOXEEJGw-AcQNMX0NLCA3_ctrtSVqUB_XLN6cWPa3ooKWWP_B1QJSW3_-M8Z4Mdpjq2Kb0kAIuhq0AOYosJebkxv_cdmQh2AdJS-DIaYAFqqy3Hy1pA",
      alt: "Modern government conference room"
    },
    {
      category: "Bimbingan Teknis",
      title: "Sosialisasi Perpres No. 12 Tahun 2021 bagi PPK",
      date: "12 Oktober 2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuFSqcd0Z5yk9a2xkNJ7a79vJ_zSW4Z5zP8NUnkNVRRjDe3qmM4ZMU16GjAJcg5u_wtl4zmFVwigfyDsHy9u7tZvjpHYymdyNswuq0osxXejPvkdJUAmx_YChq34IFqSiG5chBtF-w7Gq7mp_cz9i33HmrS02ouN6trnIeE5WhJ7pXDk1zBz2_UBXldLJeC0XOi0qlUfEkV9sZc0DB8ikJ5UNM3tdb4bokamc8SOhMYNj4ePzVnbTq0fyf71qJMPujiGPC-5zZRA",
      alt: "Professional speaker addressing an audience"
    },
    {
      category: "Internal",
      title: "Evaluasi Kinerja Vendor Pengadaan Semester I",
      date: "08 Oktober 2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9WvLnB2vg85s4qk2tU-N1We1LCOnMDwIuSdm6lwZKyeM0eE6SdXBtavraXhL7oVFxUaAUbHmjunbImoMyhXh30TqO-6HaoWVoZbTjM_2UouVxMG_tS0nqn97P8oFCtZfTX6Ao9HSaAMmFcorpAwVOfTEgqOwVuT3MvJTrwLY559oI53NlYjVhE_YpDoitTeqjzll9TF_IBqI_eygiDthRRaYT783bCTJuzUHNpnrQFLmZj0v17ZT_rcOwl1EkXoxopjfoRxhx8Q",
      alt: "Business people working"
    },
    {
      type: "tall",
      category: "Digitalisasi",
      title: "Peluncuran Dashboard Monitoring Pengadaan Real-time",
      date: "05 Oktober 2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUkP_jVAAvd6Z88xMM7jP59aiW3O5JYhAo5-R5rpqYlFshQgdfIWlBXcZQviwIYG__8r4uLXgCFxCQC3P0UUUlZ8_EuJpmXL0sTDPzKc-tBMeIdQr-Ts52zcnIOJ-08gsVtIhsxl6yJpG3vH8Pl24HZq6065CWHG4rd7hEcdXRfGH7He5KOYCS5nI53Y7Sr6kuFehM9ekYKE3j0yEQ_uiD96B41ErL7AyEEsOKrLRXPwpMdiqfE9J1hGF-_pzMkS5ISlBcoCeIw",
      alt: "Professionals collaborating around screen"
    },
    {
      category: "Penghargaan",
      title: "BPBJ Kota Semarang Raih Penghargaan UKPBJ Level 3",
      date: "28 September 2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0lEkmsxiY5C3reiS1fKfxMkL10sxM5lbY7H5PqDJtdSRBJaIfT9Na91Wgx4BpTUYE61DgWZfOqAxuBP9DkS4mm4zqG0V6vPgHO-OsXzxMF5cyBYW7Bnz_2KwVtZzRTeQYFYT4YI6ABD5bVhDfjg5K6CCW3bWTQAtWwWFC7hd8t3eXMEgKEPSMma21Sx5WngoqZ01RSFcIHw_lvDPg2yQwuDJjfN8mi4vmv3xg541BTk0QTv1kxnNJ59CyJqsfwMWngWSpwUP1jA",
      alt: "Formal handshake"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Large Featured Card */}
        <div className="lg:col-span-2 group relative overflow-hidden bg-surface-container-low aspect-[16/9]">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={cards[0].image} alt={cards[0].alt} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <div className="mb-2">
              <span className="px-2 py-1 bg-tertiary-container text-white text-[10px] font-bold uppercase tracking-wider">{cards[0].category}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{cards[0].title}</h3>
            <div className="flex items-center text-white/70 text-sm gap-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">calendar_today</span> {cards[0].date}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> {cards[0].location}</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group bg-surface-container-lowest overflow-hidden">
          <div className="aspect-square overflow-hidden bg-surface-container-low">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={cards[1].image} alt={cards[1].alt} />
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{cards[1].category}</p>
            <h4 className="text-xl font-bold text-on-surface mb-3 leading-tight">{cards[1].title}</h4>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-on-surface-variant">{cards[1].date}</span>
              <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">LIHAT DETAIL <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group bg-surface-container-lowest overflow-hidden">
          <div className="aspect-square overflow-hidden bg-surface-container-low">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={cards[2].image} alt={cards[2].alt} />
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{cards[2].category}</p>
            <h4 className="text-xl font-bold text-on-surface mb-3 leading-tight">{cards[2].title}</h4>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-on-surface-variant">{cards[2].date}</span>
              <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">LIHAT DETAIL <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
            </div>
          </div>
        </div>

        {/* Card 4 - Vertical Tall */}
        <div className="group bg-surface-container-lowest overflow-hidden">
          <div className="aspect-[3/4] overflow-hidden bg-surface-container-low">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={cards[3].image} alt={cards[3].alt} />
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{cards[3].category}</p>
            <h4 className="text-xl font-bold text-on-surface mb-3 leading-tight">{cards[3].title}</h4>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-on-surface-variant">{cards[3].date}</span>
              <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">LIHAT DETAIL <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="group bg-surface-container-lowest overflow-hidden">
          <div className="aspect-square overflow-hidden bg-surface-container-low">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={cards[4].image} alt={cards[4].alt} />
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{cards[4].category}</p>
            <h4 className="text-xl font-bold text-on-surface mb-3 leading-tight">{cards[4].title}</h4>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-on-surface-variant">{cards[4].date}</span>
              <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">LIHAT DETAIL <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
            </div>
          </div>
        </div>

        {/* Pagination/Load More */}
        <div className="lg:col-span-3 flex justify-center py-12">
          <button className="group flex items-center gap-3 bg-surface-container-high px-12 py-4 rounded-md font-bold text-on-surface hover:bg-primary hover:text-on-primary transition-all duration-300">
            MUAT LEBIH BANYAK
            <span className="material-symbols-outlined transition-transform group-hover:rotate-180">keyboard_arrow_down</span>
          </button>
        </div>

      </div>
    </section>
  );
}
