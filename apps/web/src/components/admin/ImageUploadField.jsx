import { useRef, useState } from 'react';

export default function ImageUploadField({
  id,
  label = 'Gambar',
  value,
  onChange,
  required = false,
  previewAlt = 'Preview gambar',
  aspectClass = 'aspect-video',
  compact = false,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const fieldRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const markChanged = () => {
    fieldRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      markChanged();
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    readFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    readFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label className={`block text-sm font-medium text-slate-700 ${compact ? 'mb-1' : 'mb-1.5'}`}>{label}</label>
      <div
        ref={fieldRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) return;
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (disabled) return;
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'} rounded-lg border bg-slate-50/80 outline-none transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 ${compact ? 'p-2.5' : 'p-3'} ${
          isDragging ? 'border-primary bg-primary/5' : `border-slate-200 ${disabled ? '' : 'hover:border-primary/40 hover:bg-white'}`
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          required={required && !value}
          disabled={disabled}
          onChange={handleFileChange}
          className="sr-only"
        />
        {value ? (
          <div className={`${compact ? 'mb-2' : 'mb-3'} overflow-hidden rounded-lg border border-slate-200 bg-white`}>
            <img src={value} alt={previewAlt} className={`block w-full object-cover ${aspectClass}`} />
          </div>
        ) : (
          <div className={`${compact ? 'mb-2' : 'mb-3'} flex w-full ${aspectClass} flex-col items-center justify-center rounded-lg bg-white text-slate-400`}>
            <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
            <span className="mt-2 text-xs font-semibold text-slate-400">Preview foto</span>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Klik area ini untuk pilih file</p>
            {!compact && <p className="mt-1 text-xs text-slate-400">atau drag gambar dari folder ke sini.</p>}
          </div>
          {value && !disabled && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange('');
                markChanged();
              }}
              className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
