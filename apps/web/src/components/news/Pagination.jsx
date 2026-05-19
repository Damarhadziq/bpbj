export default function Pagination() {
  return (
    <nav className="flex items-center justify-center gap-2 mb-24 cursor-pointer">
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-variant transition-all font-medium">2</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-variant transition-all font-medium">3</button>
      <span className="px-2 text-on-surface-variant">...</span>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-variant transition-all font-medium">12</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  );
}
