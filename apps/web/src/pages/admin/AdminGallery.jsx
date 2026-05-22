import { useRef, useState } from 'react';
import { useGallery, useCreateGallery, useUpdateGallery, useDeleteGallery } from '../../hooks/useGallery';
import { GALLERY_CATEGORIES } from '../../constants/categories';

const DEFAULT_GALLERY_CATEGORY = GALLERY_CATEGORIES[1];

const createEmptyForm = (toInputDate) => ({
  title: '',
  category: DEFAULT_GALLERY_CATEGORY,
  location: '',
  date: toInputDate(),
  description: '',
  galleryImages: [],
  isFeatured: false,
});

const normalizeGalleryImages = (item) => {
  const images = Array.isArray(item.galleryImages) && item.galleryImages.length > 0
    ? item.galleryImages
    : item.imageUrl
      ? [{ imageUrl: item.imageUrl, imageAlt: item.imageAlt || item.title, isCover: true }]
      : [];
  const coverIndex = images.findIndex((image) => image.isCover);

  return images.map((image, index) => ({
    imageUrl: image.imageUrl,
    imageAlt: image.imageAlt || '',
    isCover: images.length === 1 || index === (coverIndex >= 0 ? coverIndex : 0),
  }));
};

function GalleryImageManager({ images, title, onChange }) {
  const inputRef = useRef(null);

  const updateImages = (nextImages) => {
    const coverIndex = nextImages.findIndex((image) => image.isCover);
    onChange(nextImages.map((image, index) => ({
      ...image,
      isCover: nextImages.length === 1 || index === (coverIndex >= 0 ? coverIndex : 0),
    })));
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        imageUrl: reader.result,
        imageAlt: title || file.name,
        isCover: false,
      });
      reader.readAsDataURL(file);
    }))).then((newImages) => {
      const nextImages = [...images, ...newImages];
      updateImages(nextImages.map((image, index) => ({
        ...image,
        isCover: images.length === 0 && index === 0 ? true : image.isCover,
      })));
    });

    event.target.value = '';
  };

  const setCover = (targetIndex) => {
    updateImages(images.map((image, index) => ({ ...image, isCover: index === targetIndex })));
  };

  const updateAlt = (targetIndex, imageAlt) => {
    updateImages(images.map((image, index) => index === targetIndex ? { ...image, imageAlt } : image));
  };

  const removeImage = (targetIndex) => {
    updateImages(images.filter((_, index) => index !== targetIndex));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-semibold text-slate-700">Foto Galeri</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          Tambah Foto
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-primary hover:text-primary"
        >
          <span className="material-symbols-outlined text-4xl">photo_library</span>
          <span className="mt-2 text-sm font-medium">Pilih satu atau beberapa foto</span>
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <div key={`${image.imageUrl}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-video bg-slate-100">
                <img src={image.imageUrl} alt={image.imageAlt || title || 'Foto galeri'} className="h-full w-full object-cover" />
                {image.isCover && (
                  <span className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Cover
                  </span>
                )}
              </div>
              <div className="space-y-3 p-3">
                <input
                  type="text"
                  value={image.imageAlt}
                  onChange={(event) => updateAlt(index, event.target.value)}
                  placeholder="Alt text foto"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCover(index)}
                    disabled={image.isCover}
                    className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-default disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Jadikan Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                    aria-label="Hapus foto"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-400">Foto yang dipilih sebagai cover akan dipakai untuk kartu galeri dan gambar utama halaman detail.</p>
    </div>
  );
}

export default function AdminGallery() {
  const { data: galleryData = [], isLoading } = useGallery();
  const createMutation = useCreateGallery();
  const updateMutation = useUpdateGallery();
  const deleteMutation = useDeleteGallery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const toInputDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState(createEmptyForm(toInputDate));

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setFormData(createEmptyForm(toInputDate));
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      title: item.title,
      category: item.category,
      location: item.location || '',
      date: toInputDate(item.date),
      description: item.description,
      galleryImages: normalizeGalleryImages(item),
      isFeatured: item.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      ['Judul', formData.title],
      ['Kategori', formData.category],
      ['Lokasi', formData.location],
      ['Tanggal Kegiatan', formData.date],
      ['Deskripsi', formData.description],
    ];
    const emptyField = requiredFields.find(([, value]) => !String(value || '').trim());

    if (emptyField) {
      setFormError(`${emptyField[0]} wajib diisi sebelum menyimpan galeri.`);
      return;
    }

    if (formData.galleryImages.length === 0) {
      setFormError('Minimal satu foto wajib ditambahkan sebelum menyimpan galeri.');
      return;
    }

    const normalizedImages = normalizeGalleryImages(formData);
    const payload = {
      ...formData,
      galleryImages: normalizedImages,
      imageUrl: normalizedImages.find((image) => image.isCover)?.imageUrl || normalizedImages[0].imageUrl,
      imageAlt: normalizedImages.find((image) => image.isCover)?.imageAlt || formData.title,
    };

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Memuat data galeri...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Galeri</h1>
          <p className="mt-1 text-slate-500">Total {galleryData.length} item.</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-primary/90">
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Galeri
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryData.map((item) => {
          const images = normalizeGalleryImages(item);
          const cover = images.find((image) => image.isCover) || images[0];

          return (
            <div key={item.id} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                {cover?.imageUrl ? (
                  <img src={cover.imageUrl} alt={cover.imageAlt || item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-5xl">image</span>
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <span className="rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{item.category}</span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm">{images.length} foto</span>
                </div>
                {item.isFeatured && (
                  <div className="absolute right-3 top-3">
                    <span className="rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-white">Utama</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h4 className="mb-1 line-clamp-1 font-bold text-slate-800">{item.title}</h4>
                <p className="mb-3 text-xs text-slate-400">{formatDate(item.date)} {item.location && `- ${item.location}`}</p>
                <p className="mb-4 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(item)} className="flex-1 rounded-lg bg-blue-50 py-2 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {galleryData.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <span className="material-symbols-outlined mb-3 text-5xl opacity-30">photo_library</span>
            <p>Belum ada galeri. Klik "Tambah Galeri" untuk mulai.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-8 py-5">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Galeri' : 'Tambah Galeri Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-8">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Judul</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Kategori</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20">
                    {GALLERY_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Lokasi</label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Balai Kota Semarang"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tanggal Kegiatan</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <GalleryImageManager
                images={formData.galleryImages}
                title={formData.title}
                onChange={(galleryImages) => setFormData({ ...formData, galleryImages })}
              />
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Deskripsi</label>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-5 w-5 rounded text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-slate-700">Tampilkan di halaman utama</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Galeri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
