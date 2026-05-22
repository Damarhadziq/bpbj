import { useState, useEffect } from 'react';

const navItems = [
  { id: 'tentang-kami', label: 'Tentang Kami' },
  { id: 'visi-misi', label: 'Visi & Misi' },
  { id: 'tugas-fungsi', label: 'Tugas & Fungsi' },
  { id: 'struktur', label: 'Struktur Organisasi' }
];

export default function ProfileSidebar() {
  const [activeSection, setActiveSection] = useState('tentang-kami');

  const handleClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed navbar
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120; // offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-32">
      <p className="text-xs font-bold text-primary mb-6 tracking-widest uppercase">Navigasi Profil</p>
      <nav className="space-y-1">
        {navItems.map(item => {
          const isActive = activeSection === item.id;
          return (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-surface-container-high text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span>{item.label}</span>
              <span className={`material-symbols-outlined text-sm transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                arrow_forward
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
