export default function NewsGrid() {
  const articles = [
    {
      date: "09 OKT 2024",
      category: "TENDER",
      title: "Daftar Pemenang Tender Renovasi Jembatan Mberok Tahap II",
      summary: "Informasi transparan mengenai pemenang tender renovasi jembatan bersejarah di Kota Lama Semarang sesuai dengan hasil seleksi teknis.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANQSC6Ft1tMnpeEcjnGHQo4opnl2iLiEq8Z2eGIo1P0AekE2FVF3JlBqotazDwK5j9vKCm6yJKQXcrWQGvJj8gLvAYHV0fvRQTUqi8BCMe7Xr4jSCwhtqn7wROO2j4Zqrl3qXHV_7ppSjUPRQkW9XtgqNJsceEcdFjspHQFqwEdi4O359k95TCjmdYa68qjtbIgW0oaBH8UKotWFiqnoAFWpnPRdvaZuWycmyPrK2zsemvkHJCcCj0Gqw2Uz6ec26xctrN3sQeCw"
    },
    {
      date: "05 OKT 2024",
      category: "PENGUMUMAN",
      title: "Sosialisasi Penggunaan Produk Dalam Negeri (P3DN) di Lingkungan Pemkot",
      summary: "Mendorong pertumbuhan industri lokal dengan mewajibkan penggunaan produk dalam negeri dalam setiap proses pengadaan pemerintah.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD77gS8xAqP9880Nn3MWEHfgLbPwbj6UfThB6CR6jaS-G9MTUQLM_vJQ1wIPIJ9r336Uv68aGHTHmv9Tgc2tS4DG9ekYwcgiF2CkbLe4FflII9xG5P6hlMmAzsb_sh0POOdGKUNOXZM9FZ3ncXIM89ppw-GU2YM03Za5Zv-OYK2lN_ZrE1Yy14NH5-1MaOIPpVwVYfOYzYmFnUDpJ_OGYYhSwY0fmUvuwWAUT0Eh-rUcNHns9N11eIf-dqd27ByS-BXOd9g_eE1g"
    },
    {
      date: "01 OKT 2024",
      category: "LAYANAN",
      title: "Laporan Realisasi Anggaran Pengadaan Barang dan Jasa Kuartal III",
      summary: "Wujud akuntabilitas publik melalui publikasi capaian realisasi anggaran pengadaan yang telah dilaksanakan sepanjang tahun 2024.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlrbbFqj8ODW_A26g5TfeRQ2iBUn2hXzZsFpoaSzR2Pxl_5D3EUFOIaC8530U4M-IKWtBwpO21OiCE-sQiPeHnoODad6AuPLi08IeSQr4tXIGEKMwHtA2-MDvd6RKwa6bWpO1D7kqfYyCjISLzL0qcFANUMAT4xGEzEl1q8vAOJe51abh-MUADvJ6-Fe1eWKDHNBAW27orK9YEJ9InJDRPeuF6YyVIwFtWUw-qqXUDD8SyGRWRFsEWmpR9HsznuLmWQSUDFlw4Rw"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
      {articles.map((article, idx) => (
        <article key={idx} className="flex flex-col">
          <div className="aspect-video rounded-xl overflow-hidden bg-surface-container-low mb-5 relative group">
            <img alt={article.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.image}/>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant mb-3 uppercase tracking-tighter">
            <span className="bg-surface-container-highest px-2 py-0.5 rounded">{article.date}</span>
            <span>{article.category}</span>
          </div>
          <h4 className="text-xl font-bold mb-3 leading-tight hover:text-primary cursor-pointer transition-colors">{article.title}</h4>
          <p className="text-on-surface-variant text-sm line-clamp-3 mb-6">{article.summary}</p>
          <div className="mt-auto flex items-center gap-2 text-primary font-bold text-xs uppercase cursor-pointer hover:gap-4 transition-all">
            Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </article>
      ))}
    </div>
  );
}
