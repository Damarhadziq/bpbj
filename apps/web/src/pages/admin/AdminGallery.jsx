import { useMemo, useRef, useState } from 'react';
import { useGallery, useCreateGallery, useUpdateGallery, useDeleteGallery } from '../../hooks/useGallery';
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_ALL, getGalleryCategory } from '../../constants/categories';
import { AdminButton, AdminCategoryBadge, AdminConfirmDialog, AdminField, AdminModal, AdminPageHeader, AdminSelect, AdminTableCard, AdminTextarea, AdminTextInput } from '../../components/admin/AdminUI';

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 data' },
  { value: 20, label: '20 data' },
  { value: 50, label: '50 data' },
  { value: 'all', label: 'Semua data' },
];

const createEmptyForm = (toInputDate) => ({
  title: '',
  category: '',
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
  const managerRef = useRef(null);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const markChanged = () => {
    managerRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const updateImages = (nextImages) => {
    const coverIndex = nextImages.findIndex((image) => image.isCover);
    onChange(nextImages.map((image, index) => ({
      ...image,
      isCover: nextImages.length === 1 || index === (coverIndex >= 0 ? coverIndex : 0),
    })));
  };

  const processFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
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
      markChanged();
    });
  };

  const handleFiles = (event) => {
    processFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  const dropzoneClasses = `flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border bg-slate-50 px-4 py-8 text-center text-slate-400 outline-none transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 ${
    isDragging ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-primary/40 hover:bg-white hover:text-primary'
  }`;

  const setCover = (targetIndex) => {
    updateImages(images.map((image, index) => ({ ...image, isCover: index === targetIndex })));
    markChanged();
  };

  const updateAlt = (targetIndex, imageAlt) => {
    updateImages(images.map((image, index) => index === targetIndex ? { ...image, imageAlt } : image));
    markChanged();
  };

  const removeImage = (targetIndex) => {
    updateImages(images.filter((_, index) => index !== targetIndex));
    markChanged();
  };

  return (
    <div ref={managerRef}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-slate-700">Foto Galeri</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          Tambah Foto
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`${dropzoneClasses} ${images.length > 0 ? 'mb-4 py-5' : 'h-44'}`}
      >
        <span className="material-symbols-outlined text-4xl">photo_library</span>
        <span className="mt-2 text-sm font-medium">Klik untuk pilih foto</span>
        <span className="mt-1 text-xs">atau drag satu/beberapa gambar dari folder ke sini.</span>
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <div key={`${image.imageUrl}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-video bg-slate-100">
                <img src={image.imageUrl} alt={image.imageAlt || title || 'Foto galeri'} className="h-full w-full object-cover" />
                {image.isCover && (
                  <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
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
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCover(index)}
                    disabled={image.isCover}
                    className="flex-1 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-default disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Jadikan Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-md px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(GALLERY_CATEGORY_ALL);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const toInputDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState(createEmptyForm(toInputDate));
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categoryOptions = [
    { value: GALLERY_CATEGORY_ALL, label: 'Semua tag' },
    ...GALLERY_CATEGORIES.map((category) => ({ value: category, label: category })),
  ];
  const filteredGallery = useMemo(() => galleryData.filter((item) => {
    const itemCategory = getGalleryCategory(item.category);
    const categoryMatches = selectedCategory === GALLERY_CATEGORY_ALL || itemCategory === selectedCategory;
    const images = normalizeGalleryImages(item);
    const searchMatches = !normalizedSearch || [
      item.title,
      item.location,
      item.description,
      itemCategory,
      item.isFeatured ? 'utama' : '',
      `${images.length} foto`,
      ...images.map((image) => image.imageAlt),
    ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));

    return categoryMatches && searchMatches;
  }), [galleryData, normalizedSearch, selectedCategory]);
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredGallery.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedGallery = pageSize === 'all'
    ? filteredGallery
    : filteredGallery.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
  const firstItem = filteredGallery.length === 0 || pageSize === 'all' ? (filteredGallery.length ? 1 : 0) : ((safeCurrentPage - 1) * pageSize) + 1;
  const lastItem = pageSize === 'all' ? filteredGallery.length : Math.min(safeCurrentPage * pageSize, filteredGallery.length);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Memuat data galeri...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Dokumentasi"
        title="Kelola Galeri Kegiatan"
        actions={<AdminButton onClick={openCreateModal} icon="add">Tambah Galeri</AdminButton>}
      />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-md">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
          <AdminTextInput
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari judul, lokasi, deskripsi, atau status"
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(180px,220px)_minmax(140px,160px)] xl:flex xl:items-center xl:justify-end">
          <AdminSelect
            value={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            options={categoryOptions}
            size="sm"
          />
          <AdminSelect
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            options={PAGE_SIZE_OPTIONS}
            size="sm"
          />
        </div>
        <p className="text-sm font-medium text-slate-500 xl:ml-2">
          Menampilkan {firstItem}-{lastItem} dari {filteredGallery.length} galeri
        </p>
      </div>

      <AdminTableCard>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Galeri</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Kategori</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Tanggal</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Foto</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Beranda</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedGallery.map((item) => {
                const images = normalizeGalleryImages(item);
                const cover = images.find((image) => image.isCover) || images[0];

                return (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cover?.imageUrl ? (
                          <img src={cover.imageUrl} alt="" className="h-12 w-16 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="max-w-xs truncate font-semibold text-slate-800">{item.title}</p>
                          <p className="max-w-xs truncate text-xs text-slate-400">{item.location || 'Tanpa lokasi'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminCategoryBadge category={item.category} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{images.length} foto</td>
                    <td className="px-6 py-4">
                      {item.isFeatured ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Tampil</span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditModal(item)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => setDeleteTarget(item)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Hapus">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredGallery.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                    {galleryData.length === 0 ? 'Belum ada galeri. Klik "Tambah Galeri" untuk mulai.' : 'Tidak ada galeri yang cocok dengan pencarian atau filter tag.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </AdminTableCard>

      {filteredGallery.length > 0 && pageSize !== 'all' && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-500">
            Halaman {safeCurrentPage} dari {totalPages}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AdminModal eyebrow="Dokumentasi" title={editingItem ? 'Edit Galeri Kegiatan' : 'Tambah Galeri Kegiatan'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-5xl">
            <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}
              <AdminField label="Judul">
                <AdminTextInput type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Tulis judul galeri" />
              </AdminField>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AdminField label="Kategori">
                  <AdminSelect
                    value={formData.category}
                    onChange={(category) => setFormData({ ...formData, category })}
                    options={GALLERY_CATEGORIES}
                    placeholder="Pilih kategori galeri"
                  />
                </AdminField>
                <AdminField label="Lokasi">
                  <AdminTextInput type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Balai Kota Semarang"
                  />
                </AdminField>
              </div>
              <AdminField label="Tanggal Kegiatan">
                <AdminTextInput type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="Pilih tanggal kegiatan" />
              </AdminField>
              <GalleryImageManager
                images={formData.galleryImages}
                title={formData.title}
                onChange={(galleryImages) => setFormData({ ...formData, galleryImages })}
              />
              <AdminField label="Deskripsi">
                <AdminTextarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Tulis deskripsi kegiatan galeri" />
              </AdminField>
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-200 text-primary focus-visible:ring-primary/10" />
                <span>
                  <span className="block text-sm font-medium text-slate-700">Prioritaskan tampil di beranda</span>
                  <span className="block text-xs font-medium text-slate-500">Galeri yang dicentang akan didahulukan pada section Galeri Kegiatan di halaman utama.</span>
                </span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Galeri'}
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus galeri?"
          description={`Galeri "${deleteTarget.title}" beserta daftar fotonya akan dihapus permanen.`}
          confirmText="Hapus Galeri"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
