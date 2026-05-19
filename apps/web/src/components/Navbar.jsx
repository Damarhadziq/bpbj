import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const baseLinkClass = "transition-colors";
  const activeLinkStyle = "text-red-700 dark:text-red-500 font-bold border-b-2 border-red-700 dark:border-red-500 pb-1";
  const inactiveLinkStyle = "text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400";

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none font-['Inter'] antialiased tracking-tight">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-black tracking-tighter text-red-700 dark:text-red-500 uppercase">
          BPBJ Kota Semarang
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${baseLinkClass} ${currentPath === '/' ? activeLinkStyle : inactiveLinkStyle}`}>Home</Link>
          <Link to="/profile" className={`${baseLinkClass} ${currentPath === '/profile' ? activeLinkStyle : inactiveLinkStyle}`}>Profile</Link>
          <Link to="/news" className={`${baseLinkClass} ${currentPath === '/news' ? activeLinkStyle : inactiveLinkStyle}`}>News</Link>
          <Link to="/gallery" className={`${baseLinkClass} ${currentPath === '/gallery' ? activeLinkStyle : inactiveLinkStyle}`}>Gallery</Link>
          <Link to="/contact" className={`${baseLinkClass} ${currentPath === '/contact' ? activeLinkStyle : inactiveLinkStyle}`}>Contact</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {currentPath === '/gallery' && (
            <div className="hidden lg:flex items-center bg-surface-container-high px-3 py-1.5 rounded-md">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-body outline-none" placeholder="Search activities..." type="text"/>
            </div>
          )}
          {currentPath === '/news' && (
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input className="bg-surface-container-high border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64 outline-none text-on-surface" placeholder="Cari berita..." type="text"/>
            </div>
          )}
          {currentPath !== '/gallery' && currentPath !== '/news' && (
            <button className="material-symbols-outlined text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md transition-all">search</button>
          )}
          <button className="bg-primary text-on-primary px-6 py-2 rounded-md font-bold hover:bg-primary-container transition-all active:scale-95 duration-200">
            Login
          </button>
        </div>
        
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all active:scale-95 duration-200">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
