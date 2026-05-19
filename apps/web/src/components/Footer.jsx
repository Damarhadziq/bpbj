export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto font-['Inter'] text-sm leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="text-lg font-bold text-red-700 dark:text-red-500">BPBJ Kota Semarang</div>
          <p className="text-slate-500 dark:text-slate-400">Pusat keunggulan pengadaan barang dan jasa yang transparan, akuntabel, dan berintegritas untuk kemajuan Kota Semarang.</p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Tautan Penting</h4>
          <div className="grid grid-cols-2 gap-2">
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-all" href="#">Address</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-all" href="#">Email</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-all" href="#">Phone</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-all" href="#">Social Media</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-all" href="#">Privacy</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline transition-all" href="#">Terms</a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Newsletter</h4>
          <div className="flex gap-2">
            <input className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 w-full text-xs text-on-surface" placeholder="Email Anda" type="email" />
            <button className="bg-primary text-white px-4 py-2 font-bold text-xs uppercase hover:bg-primary-container transition-colors">Daftar</button>
          </div>
          <p className="text-[10px] text-slate-400">© 2024 BPBJ Kota Semarang. The Transparent Monolith.</p>
        </div>
      </div>
    </footer>
  );
}
