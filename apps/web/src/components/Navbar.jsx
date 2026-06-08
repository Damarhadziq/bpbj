import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoSemarang from '../assets/logo-semarang.png';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const baseLinkClass = "font-medium transition-colors";
  const activeLinkStyle = "text-red-700 dark:text-red-500 font-semibold";
  const inactiveLinkStyle = "text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400";
  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Profil', path: '/profile' },
    { label: 'Berita', path: '/news' },
    { label: 'Galeri', path: '/gallery' },
    { label: 'Kontak', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none font-['Inter'] antialiased tracking-tight">
      <div className="flex justify-between items-center px-5 sm:px-6 py-3.5 md:py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3 group">
          <img src={logoSemarang} alt="Logo Kota Semarang" className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200" />
          <div className="min-w-0 text-base sm:text-xl font-black tracking-tight sm:tracking-tighter text-red-700 dark:text-red-500 uppercase leading-tight">
            BPBJ Kota Semarang
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`${baseLinkClass} ${currentPath === item.path ? activeLinkStyle : inactiveLinkStyle}`}>
              {item.label}
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all active:scale-95 duration-200"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}>
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                currentPath === item.path
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
