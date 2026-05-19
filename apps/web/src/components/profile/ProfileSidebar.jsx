export default function ProfileSidebar() {
  return (
    <div className="sticky top-32">
      <p className="text-xs font-bold text-primary mb-6 tracking-widest uppercase">Navigasi Profil</p>
      <nav className="space-y-1">
        <a className="flex items-center justify-between px-4 py-3 bg-surface-container-high text-primary font-bold rounded-lg group transition-all" href="#tentang-kami">
          <span>Tentang Kami</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
        <a className="flex items-center justify-between px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all group" href="#visi-misi">
          <span>Visi &amp; Misi</span>
          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">arrow_forward</span>
        </a>
        <a className="flex items-center justify-between px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all group" href="#tugas-fungsi">
          <span>Tugas &amp; Fungsi</span>
          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">arrow_forward</span>
        </a>
        <a className="flex items-center justify-between px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all group" href="#struktur">
          <span>Struktur Organisasi</span>
          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">arrow_forward</span>
        </a>
      </nav>
    </div>
  );
}
