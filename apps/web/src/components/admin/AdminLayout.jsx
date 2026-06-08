import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSession, signOut, getSession } from '../../lib/authClient';
import { useUpdateOwnProfile } from '../../hooks/useUsers';
import { useContacts } from '../../hooks/useContacts';
import SEOHead from '../SEOHead';
import { pageSEO } from '../../utils/seoConfig';
import ImageUploadField from './ImageUploadField';
import { AdminButton, AdminField, AdminModal, AdminTextInput } from './AdminUI';

const faviconLogo = '/favicon.png';
const ADMIN_IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const ADMIN_IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
const ADMIN_SESSION_CHECK_MS = 20 * 1000;

export default function AdminLayout() {
  const { data: session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [localProfile, setLocalProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', image: '' });
  const updateOwnProfileMutation = useUpdateOwnProfile();
  const { data: contacts = [] } = useContacts({ enabled: Boolean(session?.user) });
  const unreadContacts = contacts.filter((contact) => contact.status === 'UNREAD').length;

  const profile = localProfile || session?.user || {};
  const initials = useMemo(() => {
    const name = profile.name || profile.email || 'Admin';
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }, [profile.name, profile.email]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  useEffect(() => {
    let idleTimer;

    const logoutDueToIdle = async () => {
      window.__adminClearUnsavedChanges?.();
      await signOut();
      navigate('/admin/login?reason=session-expired', { replace: true });
    };

    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(logoutDueToIdle, ADMIN_IDLE_TIMEOUT_MS);
    };

    resetIdleTimer();
    ADMIN_IDLE_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });

    return () => {
      window.clearTimeout(idleTimer);
      ADMIN_IDLE_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
    };
  }, [navigate]);

  useEffect(() => {
    if (!session?.user) return undefined;

    let isChecking = false;
    let isActive = true;

    const validateCurrentSession = async () => {
      if (isChecking || !isActive) return;
      isChecking = true;
      try {
        const { data } = await getSession();
        if (isActive && !data) {
          window.__adminClearUnsavedChanges?.();
          navigate('/admin/login?reason=session-replaced', { replace: true });
        }
      } finally {
        isChecking = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') validateCurrentSession();
    };

    const interval = window.setInterval(validateCurrentSession, ADMIN_SESSION_CHECK_MS);
    window.addEventListener('focus', validateCurrentSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActive = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', validateCurrentSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, session?.user]);

  const hasUnsavedChanges = () => window.__adminHasUnsavedChanges?.() === true;

  const handleNavigation = (path) => {
    if (location.pathname === path) return;
    if (hasUnsavedChanges()) {
      setPendingNavigation(path);
      return;
    }
    navigate(path);
  };

  const confirmNavigation = () => {
    const target = pendingNavigation;
    window.__adminClearUnsavedChanges?.();
    setPendingNavigation(null);
    if (target) navigate(target);
  };

  const openProfileModal = () => {
    setProfileError('');
    setProfileForm({
      name: profile.name || '',
      image: profile.image || '',
    });
    setIsProfileMenuOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');

    try {
      const updatedProfile = await updateOwnProfileMutation.mutateAsync(profileForm);
      setLocalProfile(updatedProfile);
      setIsProfileModalOpen(false);
    } catch (error) {
      setProfileError(error.response?.data?.error || 'Profil gagal disimpan. Periksa nama dan foto lalu coba lagi.');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', roles: ['admin', 'superadmin'] },
    { name: 'Carousel', path: '/admin/carousel', icon: 'view_carousel', roles: ['admin', 'superadmin'] },
    { name: 'Berita', path: '/admin/news', icon: 'article', roles: ['admin', 'superadmin'] },
    { name: 'Galeri', path: '/admin/gallery', icon: 'photo_library', roles: ['admin', 'superadmin'] },
    { name: 'Layanan Lainnya', path: '/admin/service-links', icon: 'widgets', roles: ['admin', 'superadmin'] },
    { name: 'Pegawai BPBJ', path: '/admin/employees', icon: 'badge', roles: ['admin', 'superadmin'] },
    { name: 'Regulasi', path: '/admin/regulations', icon: 'gavel', roles: ['admin', 'superadmin'] },
    { name: 'Pengaduan', path: '/admin/contacts', icon: 'forum', roles: ['admin', 'superadmin'], unreadCount: unreadContacts },
    { name: 'Sambutan Kepala', path: '/admin/welcome', icon: 'campaign', roles: ['admin', 'superadmin'] },
    { name: 'Manajemen Akun', path: '/admin/users', icon: 'manage_accounts', roles: ['superadmin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(session?.user?.role));

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-slate-900">
      <SEOHead {...pageSEO.admin} path={location.pathname} noindex />
      {/* Sidebar */}
      <aside className={`flex-shrink-0 overflow-hidden border-r border-slate-200 bg-white text-slate-600 transition-[width,transform] duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'} fixed inset-y-0 left-0 lg:sticky lg:top-0 z-20 h-screen`}>
        <div className="flex w-64 items-center justify-between p-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <img src={faviconLogo} alt="" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-tight tracking-tight text-slate-950">BPBJ Admin</h1>
                <p className="text-xs font-normal capitalize text-slate-500">{session?.user?.role}</p>
              </div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="admin-scrollbar w-64 space-y-1 overflow-y-auto p-3">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigation(item.path);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="min-w-0 flex-1">{item.name}</span>
                {item.unreadCount > 0 && (
                  <span
                    className={`flex-shrink-0 text-xs font-semibold leading-none ${isActive ? 'text-white' : 'text-primary'}`}
                    aria-label={`${item.unreadCount} pengaduan belum dibaca`}
                  >
                    {item.unreadCount > 5 ? '5+' : item.unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Admin Panel</p>
              <h2 className="text-base font-semibold tracking-tight text-slate-950">
                {filteredNav.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
              </h2>
            </div>
          </div>
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
            >
              {profile.image ? (
                <img src={profile.image} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-700">{initials}</span>
              )}
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-[180px] truncate text-sm font-medium leading-5 text-slate-900">{profile.name || 'Admin'}</span>
                <span className="block text-xs font-normal capitalize leading-4 text-slate-500">{profile.role || 'admin'}</span>
              </span>
              <span className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg shadow-slate-950/10">
                <div className="border-b border-slate-200 px-3 py-2">
                  <p className="truncate text-sm font-medium text-slate-900">{profile.email}</p>
                  <p className="text-xs text-slate-500">Email tidak dapat diubah dari profil.</p>
                </div>
                <button type="button" onClick={openProfileModal} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[18px] text-slate-500">edit</span>
                  Edit profil
                </button>
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[18px] text-slate-500">logout</span>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-main-scrollbar admin-scrollbar min-h-0 flex-1 overflow-auto bg-white p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-slate-950/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {pendingNavigation && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/10">
            <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-600">Perubahan Belum Disimpan</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Pindah menu?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Ada perubahan yang belum disimpan. Lanjut mengisi form atau keluar dari halaman ini tanpa menyimpan?</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setPendingNavigation(null)} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                Lanjut mengisi
              </button>
              <button type="button" onClick={confirmNavigation} className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                Keluar tanpa simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <AdminModal eyebrow="Profil Akun" title="Edit Profil Saya" onClose={() => setIsProfileModalOpen(false)} maxWidth="max-w-lg">
          <form onSubmit={handleProfileSubmit} className="space-y-5 p-6">
            {profileError && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{profileError}</div>}
            <ImageUploadField
              id="admin-profile-image"
              label="Foto Profil"
              value={profileForm.image}
              onChange={(image) => setProfileForm({ ...profileForm, image })}
              previewAlt="Foto profil admin"
              aspectClass="aspect-square"
              compact
            />
            <AdminField label="Nama">
              <AdminTextInput value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required placeholder="Tulis nama profil" />
            </AdminField>
            <AdminField label="Email">
              <AdminTextInput value={profile.email || ''} disabled className="bg-slate-50 text-slate-500" />
            </AdminField>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsProfileModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">Batal</button>
              <AdminButton type="submit" disabled={updateOwnProfileMutation.isPending}>
                {updateOwnProfileMutation.isPending && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                Simpan Profil
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
