export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 w-full mt-auto font-['Inter'] text-sm leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="text-lg font-bold text-red-700 dark:text-red-500">BPBJ Kota Semarang</div>
          <p className="text-slate-500 dark:text-slate-400">Pusat keunggulan pengadaan barang dan jasa yang transparan, akuntabel, dan berintegritas untuk kemajuan Kota Semarang.</p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Tautan Penting</h4>
          <div className="flex flex-col gap-2">
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all w-fit" href="/">Beranda</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all w-fit" href="/profile">Profil</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all w-fit" href="/news">Berita</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all w-fit" href="/gallery">Galeri</a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Kontak</h4>
          <div className="flex flex-col gap-2">
            <p className="text-slate-500 dark:text-slate-400">Gedung Moch. Ichsan Lt. 4</p>
            <p className="text-slate-500 dark:text-slate-400">Jl. Pemuda No. 148, Semarang</p>
            <p className="text-slate-500 dark:text-slate-400">Telp: (024) 3513366</p>
            <p className="text-slate-500 dark:text-slate-400">Email: bpbj@semarangkota.go.id</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} BPBJ Kota Semarang. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
}
