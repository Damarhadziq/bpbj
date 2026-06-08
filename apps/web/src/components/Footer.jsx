import bpbjLogoMark from '../assets/bpbj-logo-mark.png';

export default function Footer() {
  const navigationLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Kami', href: '/profile#tentang-kami' },
    { label: 'Visi & Misi', href: '/profile#visi-misi' },
    { label: 'Tugas & Fungsi', href: '/profile#tugas-fungsi' },
    { label: 'Regulasi', href: '/profile#regulasi' },
    { label: 'Struktur Organisasi', href: '/profile#struktur' },
    { label: 'Pegawai BPBJ', href: '/profile#pegawai' },
    { label: 'Berita', href: '/news' },
    { label: 'Galeri', href: '/gallery' },
    { label: 'Kontak', href: '/contact' },
    { label: 'Pengaduan', href: '/contact#pengaduan' },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 w-full mt-auto font-['Inter'] text-sm leading-relaxed">
      <img
        src={bpbjLogoMark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-4 h-56 w-56 select-none object-contain opacity-[0.045] sm:-right-10 sm:h-72 sm:w-72 md:hidden"
      />
      <div className="relative z-10 grid grid-cols-1 gap-7 px-5 py-10 sm:px-6 md:py-12 max-w-7xl mx-auto md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-12">
        <div className="space-y-4 md:max-w-sm">
          <img
            src={bpbjLogoMark}
            alt="Logo BPBJ"
            className="hidden h-9 w-9 object-contain md:block"
          />
          <div className="text-lg font-bold text-red-700 dark:text-red-500">BPBJ Kota Semarang</div>
          <p className="text-slate-500 dark:text-slate-400">Pusat keunggulan pengadaan barang dan jasa yang transparan, akuntabel, dan berintegritas untuk kemajuan Kota Semarang.</p>
        </div>
        <div className="space-y-4 md:min-w-[22rem]">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Jelajahi Website</h4>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-2">
            {navigationLinks.map((item) => (
              <a key={item.href} className="w-fit text-slate-500 transition-colors hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-4 md:ml-auto md:text-right">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Kontak</h4>
          <div className="flex flex-col gap-2.5 md:items-end">
            <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400 md:items-center">
              <span className="material-symbols-outlined text-[18px] text-primary">apartment</span>
              <span>Gedung Moch. Ichsan Lt. 6</span>
            </p>
            <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400 md:items-center">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              <span>Jl. Pemuda No. 148, Semarang</span>
            </p>
            <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400 md:items-center">
              <span className="material-symbols-outlined text-[18px] text-primary">call</span>
              <span>Telp: (024) 3513366</span>
            </p>
            <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400 md:items-center">
              <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
              <span>Email: bpbj@semarangkota.go.id</span>
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} BPBJ Kota Semarang. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
}
