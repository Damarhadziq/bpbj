import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const normalizeOptions = (options = []) => options.map((option) => (
  typeof option === 'string' ? { value: option, label: option } : option
));

const estimateMenuWidth = (options, buttonWidth) => {
  const longestLabel = options.reduce((longest, option) => {
    const label = String(option.label || '');
    return label.length > longest.length ? label : longest;
  }, '');
  const estimatedWidth = Math.min(360, Math.max(buttonWidth, longestLabel.length * 8 + 72));

  return estimatedWidth;
};

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih opsi',
  icon,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  optionClassName = '',
  size = 'md',
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Cari opsi...',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return normalizedOptions;
    return normalizedOptions.filter((option) => String(option.label || '').toLowerCase().includes(normalizedSearch));
  }, [normalizedOptions, searchTerm]);
  const selectedOption = normalizedOptions.find((option) => option.value === value);

  const sizeClasses = {
    sm: 'min-h-9 px-3 py-1.5 text-xs',
    md: 'min-h-11 px-3.5 py-2.5 text-sm',
  };

  const updateMenuRect = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const estimatedMenuHeight = Math.min(288, normalizedOptions.length * 42 + 12);
    const shouldOpenUp = rect.bottom + estimatedMenuHeight > window.innerHeight - 12;

    setMenuRect({
      left: rect.left,
      top: shouldOpenUp ? Math.max(12, rect.top - estimatedMenuHeight - 6) : rect.bottom + 6,
      width: estimateMenuWidth(normalizedOptions, rect.width),
      minWidth: rect.width,
      transformOrigin: shouldOpenUp ? 'bottom' : 'top',
    });
  }, [normalizedOptions, setMenuRect]);

  const closeMenu = () => {
    setIsOpen(false);
    setSearchTerm('');
    buttonRef.current?.blur();
  };

  const toggleMenu = () => {
    if (disabled) return;
    if (isOpen) {
      closeMenu();
      return;
    }
    updateMenuRect();
    setIsOpen(true);
  };

  const selectOption = (nextValue) => {
    onChange(nextValue);
    buttonRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
    closeMenu();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (
        buttonRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      closeMenu();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('resize', updateMenuRect);
    window.addEventListener('scroll', updateMenuRect, true);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updateMenuRect);
      window.removeEventListener('scroll', updateMenuRect, true);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updateMenuRect]);

  useEffect(() => {
    if (!isOpen || !searchable) return;
    const input = menuRef.current?.querySelector('input[type="search"]');
    const timer = setTimeout(() => input?.focus(), 0);
    return () => clearTimeout(timer);
  }, [isOpen, searchable]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={toggleMenu}
        className={`flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white text-left font-medium text-slate-800 outline-none transition-all hover:border-slate-300 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          {icon && <span className="material-symbols-outlined text-[18px] text-slate-400">{icon}</span>}
          <span className={`truncate ${selectedOption ? '' : 'text-slate-400'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <span className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && menuRect && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          className={`fixed z-[120] max-h-72 animate-[adminSelectOpen_160ms_ease-out] overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-950/10 ${menuClassName}`}
          style={{
            left: Math.min(menuRect.left, window.innerWidth - menuRect.width - 12),
            top: menuRect.top,
            minWidth: menuRect.minWidth,
            width: menuRect.width,
            transformOrigin: menuRect.transformOrigin,
          }}
        >
          {searchable && (
            <div className="sticky top-0 z-10 bg-white pb-1.5">
              <label className="relative block">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </label>
            </div>
          )}
          <div className="admin-scrollbar max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectOption(option.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-primary text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  } ${optionClassName}`}
                >
                  <span className="min-w-0 whitespace-normal break-words leading-5">{option.label}</span>
                  {selected && <span className="material-symbols-outlined text-[18px]">check</span>}
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-6 text-center text-sm font-medium text-slate-400">
                Opsi tidak ditemukan
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
