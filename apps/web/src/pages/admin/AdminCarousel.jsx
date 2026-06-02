import { useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCarousel, useCreateCarousel, useUpdateCarousel, useDeleteCarousel } from '../../hooks/useCarousel';
import { AdminButton, AdminConfirmDialog, AdminField, AdminFormSection, AdminInlineStatus, AdminModal, AdminModalActions, AdminPageHeader, AdminTableCard, AdminTextInput } from '../../components/admin/AdminUI';

const emptyForm = {
  imageUrl: '',
  imageAlt: '',
  displayOrder: 0,
  isActive: true,
};

export default function AdminCarousel() {
  const { data: carouselItems = [], isLoading } = useCarousel();
  const createMutation = useCreateCarousel();
  const updateMutation = useUpdateCarousel();
  const deleteMutation = useDeleteCarousel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm, displayOrder: carouselItems.length + 1 });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl || '',
      imageAlt: item.imageAlt || '',
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Gagal menyimpan carousel.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data carousel...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Konten Beranda"
        title="Kelola Banner Beranda"
        actions={<AdminButton onClick={openCreateModal} icon="add_photo_alternate">Tambah Carousel</AdminButton>}
      />

      <AdminTableCard>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Banner</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Urutan</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Diperbarui</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {carouselItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt="" className="h-12 w-20 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="max-w-xs truncate font-semibold text-slate-800">Carousel Image</p>
                        <p className="max-w-xs truncate text-xs text-slate-400">{item.imageAlt || 'Tanpa alt text'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.displayOrder}</td>
                  <td className="px-6 py-4">
                    <AdminInlineStatus tone={item.isActive ? 'green' : 'slate'}>{item.isActive ? 'Aktif' : 'Nonaktif'}</AdminInlineStatus>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(item.updatedAt)}</td>
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
              {carouselItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-400">Belum ada carousel. Klik "Tambah Carousel" untuk mulai.</td>
                </tr>
              )}
            </tbody>
          </table>
      </AdminTableCard>

      {isModalOpen && (
        <AdminModal eyebrow="Konten Beranda" title={editingItem ? 'Edit Banner Beranda' : 'Tambah Banner Beranda'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-4xl">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {formError && <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">{formError}</div>}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
              <div className="rounded-lg bg-slate-50 p-4">
                <ImageUploadField
                  id="carousel-image"
                  label="Upload Banner"
                  value={formData.imageUrl}
                  onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                  required
                  previewAlt={formData.imageAlt || 'Preview carousel'}
                  aspectClass="aspect-video"
                  compact
                />
              </div>
              <AdminFormSection icon="tune" title="Pengaturan Banner" description="Atur informasi alternatif, urutan, dan status tampil carousel.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminField label="Alt Text Gambar">
                  <AdminTextInput type="text" value={formData.imageAlt} onChange={(event) => setFormData({ ...formData, imageAlt: event.target.value })} placeholder="Tulis deskripsi singkat banner" />
                </AdminField>
                <AdminField label="Urutan Tampil">
                  <AdminTextInput type="number" min="0" value={formData.displayOrder} onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })} placeholder="Contoh: 1" />
                </AdminField>
              </div>
              <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-slate-800">Aktif ditampilkan di halaman utama</span>
                  <span className="block text-xs font-medium text-slate-500">Nonaktifkan untuk menyimpan banner tanpa menampilkannya.</span>
                </span>
                <input type="checkbox" checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-primary" />
              </label>
              </AdminFormSection>
            </div>
              <AdminModalActions>
                <AdminButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Batal</AdminButton>
                <AdminButton type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Carousel'}
                </AdminButton>
              </AdminModalActions>
            </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus carousel?"
          description="Banner carousel ini akan dihapus permanen dari konten beranda."
          confirmText="Hapus Carousel"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
