import { useEffect, useRef, useState } from 'react';
import CustomSelect from '../ui/CustomSelect';

export function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-primary">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div>}
    </div>
  );
}

export function AdminButton({ children, icon, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    dark: 'bg-slate-900 text-white hover:bg-slate-800',
    neutral: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-amber-600 text-white hover:bg-amber-700',
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}

export function AdminTableCard({ children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminModal({ eyebrow, title, children, maxWidth = 'max-w-3xl', onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('admin-drawer-open');

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      document.body.classList.remove('admin-drawer-open');
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const markChanged = (event) => {
      if (event.target?.closest('[data-admin-ignore-dirty]')) return;
      setHasUnsavedChanges(true);
    };

    panel.addEventListener('input', markChanged, true);
    panel.addEventListener('change', markChanged, true);

    return () => {
      panel.removeEventListener('input', markChanged, true);
      panel.removeEventListener('change', markChanged, true);
    };
  }, []);

  const startClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(onClose, 220);
  };

  const handleClose = () => {
    if (isClosing) return;
    if (hasUnsavedChanges) {
      setIsCloseConfirmOpen(true);
      return;
    }
    startClose();
  };

  const handlePanelClickCapture = (event) => {
    const button = event.target.closest('button');
    if (button?.textContent?.trim() === 'Batal') {
      event.preventDefault();
      event.stopPropagation();
      handleClose();
    }
  };

  return (
    <div className={`admin-drawer-overlay fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm ${isClosing ? 'admin-drawer-overlay-closing' : ''}`} onClick={handleClose}>
      <div ref={panelRef} className={`admin-drawer-panel admin-scrollbar h-full w-full ${maxWidth} overflow-y-auto border-l border-slate-200 bg-white ${isClosing ? 'admin-drawer-panel-closing' : ''}`} onClick={(event) => event.stopPropagation()} onClickCapture={handlePanelClickCapture}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
          </div>
          <button onClick={handleClose} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" type="button" data-admin-ignore-dirty>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
      </div>

      {isCloseConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/20 px-4" onClick={(event) => event.stopPropagation()}>
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Keluar dari form?</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Beberapa isian belum disimpan. Lanjut mengisi atau keluar tanpa menyimpan perubahan?</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100" onClick={() => setIsCloseConfirmOpen(false)}>
                Lanjut mengisi
              </button>
              <button type="button" className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90" onClick={startClose}>
                Keluar tanpa simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminFormSection({ icon, title, description, children }) {
  return (
    <div className="rounded-lg bg-slate-50 p-5">
      <div className="mb-5 flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function AdminModalActions({ children }) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
      {children}
    </div>
  );
}

export function AdminConfirmDialog({
  eyebrow = 'Aksi Berisiko',
  title = 'Hapus data?',
  description,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
  icon = 'delete',
  tone = 'red',
  onCancel,
  onConfirm,
}) {
  const tones = {
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/10">
        <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${tones[tone] || tones.red}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-red-600">{eyebrow}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
            {description && <p className="mt-2 text-sm font-normal leading-6 text-slate-500">{description}</p>}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminTextInput({ className = '', ...props }) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${className}`}
      {...props}
    />
  );
}

export function AdminSelect({ options, children, ...props }) {
  const normalizedOptions = options || (Array.isArray(children)
    ? children.map((child) => ({ value: child.props.value, label: child.props.children }))
    : []);

  return <CustomSelect options={normalizedOptions} {...props} />;
}

export function AdminTextarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${className}`}
      {...props}
    />
  );
}

export function AdminField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export function AdminInlineStatus({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function AdminCategoryBadge({ category }) {
  const palette = {
    Informasi: 'bg-blue-50 text-blue-700 border-blue-100',
    Kegiatan: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Layanan: 'bg-violet-50 text-violet-700 border-violet-100',
    Sosialisasi: 'bg-orange-50 text-orange-700 border-orange-100',
    'Market Sounding': 'bg-rose-50 text-rose-700 border-rose-100',
    Foto: 'bg-sky-50 text-sky-700 border-sky-100',
    Video: 'bg-purple-50 text-purple-700 border-purple-100',
    Dokumentasi: 'bg-teal-50 text-teal-700 border-teal-100',
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${palette[category] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>
      {category}
    </span>
  );
}
