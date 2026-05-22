import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../../lib/authClient';

export default function AdminLayout() {
  const { data: session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', roles: ['admin', 'superadmin'] },
    { name: 'Carousel', path: '/admin/carousel', icon: 'view_carousel', roles: ['admin', 'superadmin'] },
    { name: 'Berita', path: '/admin/news', icon: 'article', roles: ['admin', 'superadmin'] },
    { name: 'Galeri', path: '/admin/gallery', icon: 'photo_library', roles: ['admin', 'superadmin'] },
    { name: 'Pengaduan', path: '/admin/contacts', icon: 'forum', roles: ['admin', 'superadmin'] },
    { name: 'Sambutan Kepala', path: '/admin/welcome', icon: 'campaign', roles: ['admin', 'superadmin'] },
    { name: 'Manajemen Akun', path: '/admin/users', icon: 'manage_accounts', roles: ['superadmin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(session?.user?.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 flex-shrink-0 overflow-hidden transition-[width,transform] duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'} fixed inset-y-0 left-0 lg:sticky lg:top-0 z-20 h-screen`}>
        <div className="w-64 p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-white font-bold text-lg">BPBJ Admin</h1>
            <p className="text-xs text-slate-500 capitalize">{session?.user?.role}</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="w-64 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-slate-900">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-semibold text-slate-800">
              {filteredNav.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-slate-900 leading-none">{session?.user?.name}</p>
              <p className="text-xs text-slate-500">{session?.user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Keluar"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
