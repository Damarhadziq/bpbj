export default function ImageUploadField({
  id,
  label = 'Gambar',
  value,
  onChange,
  required = false,
  previewAlt = 'Preview gambar',
}) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {value ? (
          <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img src={value} alt={previewAlt} className="h-48 w-full object-cover" />
          </div>
        ) : (
          <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-white text-slate-400">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            id={id}
            type="file"
            accept="image/*"
            required={required && !value}
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Hapus
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-400">Pilih file gambar dari perangkat Anda.</p>
      </div>
    </div>
  );
}
