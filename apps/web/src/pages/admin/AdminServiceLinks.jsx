import { useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCreateServiceLink, useDeleteServiceLink, useServiceLinks, useUpdateServiceLink } from '../../hooks/useServiceLinks';
import { AdminButton, AdminConfirmDialog, AdminField, AdminFormSection, AdminModal, AdminModalActions, AdminPageHeader, AdminTableCard, AdminTextInput } from '../../components/admin/AdminUI';

const emptyForm = {
  imageUrl: '',
  linkUrl: '',
  displayOrder: 0,
};

export default function AdminServiceLinks() {
  const { data: links = [], isLoading } = useServiceLinks();
  const createMutation = useCreateServiceLink();
  const updateMutation = useUpdateServiceLink();
  const deleteMutation = useDeleteServiceLink();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl || '',
      linkUrl: item.linkUrl || '',
      displayOrder: item.displayOrder || 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.imageUrl || !formData.linkUrl) {
      setFormError('Logo/gambar dan link URL wajib diisi.');
      return;
    }

    if (!/^https?:\/\/[^\s]+$/i.test(formData.linkUrl)) {
      setFormError('Link URL harus diawali http:// atau https://.');
      return;
    }

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
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

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Memuat tautan layanan...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Konten Beranda"
        title="Kelola Tautan Layanan"
        actions={<AdminButton onClick={openCreateModal} icon="add">Tambah Layanan</AdminButton>}
      />

      <AdminTableCard>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Layanan</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Link URL</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Urutan</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-slate-50 p-2">
                      <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-lg truncate text-sm font-semibold text-slate-700">{item.linkUrl}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.displayOrder}</td>
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
              {links.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400">Belum ada layanan. Klik "Tambah Layanan" untuk mulai.</td>
                </tr>
              )}
            </tbody>
          </table>
      </AdminTableCard>

      {isModalOpen && (
        <AdminModal eyebrow="Konten Beranda" title={editingItem ? 'Edit Tautan Layanan' : 'Tambah Tautan Layanan'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-4xl">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {formError && (
                <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                <div className="rounded-lg bg-slate-50 p-4">
                  <ImageUploadField
                    id="service-link-image"
                    label="Logo / Gambar"
                    value={formData.imageUrl}
                    onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                    required
                    previewAlt="Preview logo layanan"
                    aspectClass="aspect-[5/3]"
                    compact
                  />
                </div>
                <AdminFormSection icon="link" title="Informasi Layanan" description="Atur tujuan tautan dan urutan logo layanan.">
                <div className="space-y-4">
                  <AdminField label="Link URL">
                    <AdminTextInput
                      type="url"
                      required
                      value={formData.linkUrl}
                      onChange={(event) => setFormData({ ...formData, linkUrl: event.target.value })}
                      placeholder="Contoh: https://contoh.go.id"
                    />
                  </AdminField>
                  <AdminField label="Urutan Tampil">
                    <AdminTextInput
                      type="number"
                      value={formData.displayOrder}
                      onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })}
                      placeholder="Contoh: 1"
                    />
                  </AdminField>
                </div>
                </AdminFormSection>
              </div>
              <AdminModalActions>
                <AdminButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Batal</AdminButton>
                <AdminButton type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </AdminButton>
              </AdminModalActions>
            </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus layanan?"
          description={`Tautan layanan "${deleteTarget.linkUrl}" akan dihapus dari beranda.`}
          confirmText="Hapus Layanan"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
