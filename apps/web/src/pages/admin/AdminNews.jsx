import { useMemo, useState } from 'react';
import { useNews, useNewsCategories, useCreateNews, useUpdateNews, useDeleteNews } from '../../hooks/useNews';
import { useSession } from '../../lib/authClient';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { NEWS_CATEGORIES, NEWS_CATEGORY_ALL, getNewsCategory } from '../../constants/categories';
import { generateSummary } from '../../utils/summary';
import { AdminButton, AdminCategoryBadge, AdminConfirmDialog, AdminField, AdminModal, AdminPageHeader, AdminSelect, AdminTableCard, AdminTextarea, AdminTextInput } from '../../components/admin/AdminUI';

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 data' },
  { value: 20, label: '20 data' },
  { value: 50, label: '50 data' },
  { value: 'all', label: 'Semua data' },
];

export default function AdminNews() {
  const { data: session } = useSession();
  const { data: newsData = [], isLoading } = useNews();
  const { data: newsCategories = NEWS_CATEGORIES } = useNewsCategories();
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const [placementError, setPlacementError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(NEWS_CATEGORY_ALL);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', date: '', summary: '', content: '', imageUrl: '', isFeatured: false, isSelected: false,
  });

  const toInputDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categoryOptions = [
    { value: NEWS_CATEGORY_ALL, label: 'Semua tag' },
    ...newsCategories.map((category) => ({ value: category, label: category })),
  ];
  const filteredNews = useMemo(() => newsData.filter((item) => {
    const itemCategory = getNewsCategory(item.category);
    const categoryMatches = selectedCategory === NEWS_CATEGORY_ALL || itemCategory === selectedCategory;
    const searchMatches = !normalizedSearch || [
      item.title,
      item.slug,
      item.summary,
      item.content,
      itemCategory,
      item.isFeatured ? 'sorotan' : '',
      item.isSelected ? 'pilihan' : '',
    ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));

    return categoryMatches && searchMatches;
  }), [newsData, normalizedSearch, selectedCategory]);
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredNews.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedNews = pageSize === 'all'
    ? filteredNews
    : filteredNews.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
  const firstItem = filteredNews.length === 0 || pageSize === 'all' ? (filteredNews.length ? 1 : 0) : ((safeCurrentPage - 1) * pageSize) + 1;
  const lastItem = pageSize === 'all' ? filteredNews.length : Math.min(safeCurrentPage * pageSize, filteredNews.length);
  const featuredNews = newsData.find((item) => item.isFeatured);
  const selectedNews = newsData.filter((item) => item.isSelected && !item.isFeatured);
  const featuredOptions = newsData.map((item) => ({ value: item.id, label: item.title }));
  const selectedOptions = newsData
    .filter((item) => !item.isSelected && !item.isFeatured)
    .map((item) => ({ value: item.id, label: item.title }));

  const buildNewsPayload = (item, overrides = {}) => ({
    title: item.title,
    slug: item.slug,
    category: getNewsCategory(item.category),
    content: item.content,
    imageUrl: item.imageUrl,
    date: toInputDate(item.date),
    isFeatured: item.isFeatured || false,
    isSelected: item.isSelected || false,
    ...overrides,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setFormData({ title: '', slug: '', category: '', date: toInputDate(), summary: '', content: '', imageUrl: '', isFeatured: false, isSelected: false });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      title: item.title, slug: item.slug, category: getNewsCategory(item.category), summary: item.summary,
      date: toInputDate(item.date), content: item.content, imageUrl: item.imageUrl || '', isFeatured: item.isFeatured, isSelected: item.isSelected || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      ['Judul', formData.title],
      ['Kategori', formData.category],
      ['Tanggal Berita/Kegiatan', formData.date],
      ['Gambar', formData.imageUrl],
      ['Konten', formData.content],
    ];
    const emptyField = requiredFields.find(([, value]) => !String(value || '').trim());

    if (emptyField) {
      setFormError(`${emptyField[0]} wajib diisi sebelum menyimpan berita.`);
      return;
    }

    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = { ...formData, slug, summary: generateSummary(formData.content), authorId: session?.user?.id };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Berita gagal disimpan. Periksa data lalu coba lagi.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const updateNewsPlacement = async (item, overrides, fallbackMessage) => {
    if (!item) return;
    setPlacementError('');

    try {
      await updateMutation.mutateAsync({ id: item.id, data: buildNewsPayload(item, overrides) });
    } catch (error) {
      setPlacementError(error.response?.data?.error || fallbackMessage);
    }
  };

  const handleSetFeatured = async (id) => {
    const item = newsData.find((newsItem) => newsItem.id === id);
    await updateNewsPlacement(item, { isFeatured: true, isSelected: false }, 'Sorotan gagal diperbarui. Coba lagi sebentar.');
  };

  const handleClearFeatured = async () => {
    await updateNewsPlacement(featuredNews, { isFeatured: false }, 'Sorotan gagal dikosongkan. Coba lagi sebentar.');
  };

  const handleAddSelected = async (id) => {
    if (selectedNews.length >= 5) {
      setPlacementError('Berita pilihan sudah mencapai batas maksimal 5 item.');
      return;
    }

    const item = newsData.find((newsItem) => newsItem.id === id);
    if (item?.isFeatured) {
      setPlacementError('Berita yang sedang menjadi sorotan tidak bisa masuk ke berita pilihan.');
      return;
    }

    await updateNewsPlacement(item, { isSelected: true }, 'Berita pilihan gagal ditambahkan. Coba lagi sebentar.');
  };

  const handleRemoveSelected = async (item) => {
    await updateNewsPlacement(item, { isSelected: false }, 'Berita pilihan gagal dihapus. Coba lagi sebentar.');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data berita...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Publikasi"
        title="Kelola Berita Website"
        actions={<AdminButton onClick={openCreateModal} icon="add">Tambah Berita</AdminButton>}
      />

      <div className="mb-6 mt-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Sorotan & Berita Pilihan</h2>

        {placementError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {placementError}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Sorotan Saat Ini</h3>
                <p className="text-xs font-medium text-slate-500">Hanya satu berita yang tampil sebagai sorotan.</p>
              </div>
              <span className="rounded-full bg-admin-list px-2.5 py-1 text-xs font-medium text-slate-600">Maks. 1</span>
            </div>
            {featuredNews ? (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-admin-list p-3">
                {featuredNews.imageUrl && <img src={featuredNews.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{featuredNews.title}</p>
                  <p className="text-xs font-medium text-slate-500">{formatDate(featuredNews.date)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFeatured}
                  disabled={updateMutation.isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:opacity-50"
                  title="Kosongkan sorotan"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div className="mb-4 rounded-lg border border-slate-200 bg-admin-list px-4 py-5 text-sm font-semibold text-slate-400">Belum ada berita sorotan.</div>
            )}
            <AdminSelect
              value=""
              onChange={handleSetFeatured}
              options={featuredOptions}
              placeholder="Pilih berita untuk sorotan"
              disabled={newsData.length === 0 || updateMutation.isPending}
              size="sm"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Berita Pilihan</h3>
                <p className="text-xs font-medium text-slate-500">Gunakan untuk kumpulan berita yang perlu tetap mudah dipindai.</p>
              </div>
              <span className="rounded-full bg-admin-list px-2.5 py-1 text-xs font-medium text-slate-600">{selectedNews.length}/5</span>
            </div>
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {selectedNews.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-admin-list p-3">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs font-medium text-slate-500">{formatDate(item.date)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelected(item)}
                    disabled={updateMutation.isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:opacity-50"
                    title="Hapus dari pilihan"
                  >
                    <span className="material-symbols-outlined text-[17px]">close</span>
                  </button>
                </div>
              ))}
              {selectedNews.length === 0 && (
                <div className="rounded-lg border border-slate-200 bg-admin-list px-4 py-5 text-sm font-semibold text-slate-400 sm:col-span-2">Belum ada berita pilihan.</div>
              )}
            </div>
            <AdminSelect
              value=""
              onChange={handleAddSelected}
              options={selectedOptions}
              placeholder={selectedNews.length >= 5 ? 'Batas 5 berita pilihan tercapai' : 'Tambah berita pilihan'}
              disabled={newsData.length === 0 || selectedNews.length >= 5 || updateMutation.isPending}
              size="sm"
            />
          </div>
        </div>
      </div>

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
            placeholder="Cari judul, slug, isi berita, atau status"
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
          Menampilkan {firstItem}-{lastItem} dari {filteredNews.length} berita
        </p>
      </div>

      <AdminTableCard>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Judul</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Kategori</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedNews.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate max-w-xs">{item.title}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{item.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminCategoryBadge category={getNewsCategory(item.category)} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(item.date)}</td>
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
            ))}
            {filteredNews.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                  {newsData.length === 0 ? 'Belum ada berita. Klik "Tambah Berita" untuk mulai.' : 'Tidak ada berita yang cocok dengan pencarian atau filter tag.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableCard>

      {filteredNews.length > 0 && pageSize !== 'all' && (
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
        <AdminModal eyebrow="Publikasi" title={editingItem ? 'Edit Konten Berita' : 'Tambah Berita'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {formError}
              </div>
            )}
            <AdminField label="Judul">
              <AdminTextInput type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Tulis judul berita" />
            </AdminField>
            <AdminField label="Slug (opsional, auto-generated)">
              <AdminTextInput type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
                placeholder="Contoh: judul-berita-terbaru"
              />
            </AdminField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminField label="Kategori">
                <AdminSelect
                  value={formData.category}
                  onChange={(category) => setFormData({...formData, category})}
                  options={newsCategories}
                  placeholder="Pilih kategori berita"
                />
              </AdminField>
              <AdminField label="Tanggal Berita/Kegiatan">
                <AdminTextInput type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="Pilih tanggal berita" />
              </AdminField>
            </div>
            <ImageUploadField
              id="news-image"
              label="Upload Gambar"
              value={formData.imageUrl}
              onChange={(imageUrl) => setFormData({...formData, imageUrl})}
              required
              previewAlt={formData.title || 'Preview gambar berita'}
            />
            <AdminField label="Konten">
              <AdminTextarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Tulis isi berita lengkap di sini" />
            </AdminField>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
                {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {editingItem ? 'Simpan Perubahan' : 'Tambah Berita'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus berita?"
          description={`Berita "${deleteTarget.title}" akan dihapus permanen dari website.`}
          confirmText="Hapus Berita"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
