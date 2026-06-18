import { useEffect, useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import {
  useAdminFloatingWidgets,
  useCreateFloatingWidget,
  useDeleteFloatingWidget,
  useUpdateFloatingWidget,
} from '../../hooks/useFloatingWidgets';
import {
  AdminButton,
  AdminConfirmDialog,
  AdminField,
  AdminFormSection,
  AdminInlineStatus,
  AdminModal,
  AdminModalActions,
  AdminPageHeader,
  AdminTableCard,
  AdminTextInput,
} from '../../components/admin/AdminUI';

const emptyForm = {
  label: '',
  description: '',
  href: '',
  imageUrl: '',
  icon: 'campaign',
  displayOrder: 0,
  isActive: true,
  openInNewTab: false,
};

const isHttpUrl = (value) => /^https?:\/\//i.test(value);
const isInternalOrExternalUrl = (value) => /^(https?:\/\/[^\s/$.?#].[^\s]*|\/[^\s]*)$/i.test(value);

function AdminToast({ toast, onClose }) {
  if (!toast) return null;

  const toneClass = toast.type === 'error'
    ? 'border-red-100 bg-red-50 text-red-700'
    : 'border-emerald-100 bg-emerald-50 text-emerald-700';
  const icon = toast.type === 'error' ? 'error' : 'check_circle';

  return (
    <div className={`fixed right-5 top-20 z-[90] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg shadow-slate-950/10 ${toneClass}`} role="status">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <p className="min-w-0 flex-1">{toast.message}</p>
      <button type="button" onClick={onClose} className="rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100" aria-label="Tutup notifikasi">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

export default function AdminFloatingWidgets() {
  const { data: widgets = [], isLoading } = useAdminFloatingWidgets();
  const createMutation = useCreateFloatingWidget();
  const updateMutation = useUpdateFloatingWidget();
  const deleteMutation = useDeleteFloatingWidget();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || '',
      description: item.description || '',
      href: item.href || '',
      imageUrl: item.imageUrl || '',
      icon: item.icon || '',
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive !== false,
      openInNewTab: item.openInNewTab === true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleHrefChange = (href) => {
    setFormData((current) => ({
      ...current,
      href,
      openInNewTab: isHttpUrl(href) ? true : current.openInNewTab,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.label.trim() || !formData.href.trim()) {
      setFormError('Nama widget dan URL wajib diisi.');
      return;
    }

    if (!formData.imageUrl && !formData.icon.trim()) {
      setFormError('Isi logo/gambar atau nama icon Material Symbols.');
      return;
    }

    if (!isInternalOrExternalUrl(formData.href)) {
      setFormError('URL harus berupa link http(s) atau path internal seperti /contact.');
      return;
    }

    const payload = {
      ...formData,
      label: formData.label.trim(),
      description: formData.label.trim(),
      href: formData.href.trim(),
      imageUrl: formData.imageUrl || null,
      icon: formData.imageUrl ? null : formData.icon.trim(),
      displayOrder: Number(formData.displayOrder) || 0,
      isActive: Boolean(formData.isActive),
      openInNewTab: Boolean(formData.openInNewTab),
    };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
        showToast('Widget berhasil diperbarui.');
      } else {
        await createMutation.mutateAsync(payload);
        showToast('Widget berhasil ditambahkan.');
      }

      setIsModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Widget gagal disimpan.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      showToast('Widget berhasil dihapus.');
    } catch (error) {
      showToast(error.response?.data?.error || 'Widget gagal dihapus.', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Memuat floating widget...</div>;
  }

  return (
    <div>
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      <AdminPageHeader
        eyebrow="Widget Website"
        title="Kelola Floating Widget"
        description="Atur widget kanan bawah website. Nama widget akan menjadi teks yang muncul saat hover."
        actions={<AdminButton onClick={openCreateModal} icon="add">Tambah Widget</AdminButton>}
      />

      <AdminTableCard>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Widget</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">URL</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Urutan</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {widgets.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 text-primary shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="h-full w-full rounded-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{item.label}</p>
                      <p className="max-w-md truncate text-sm text-slate-500">Teks hover: {item.label}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="max-w-sm truncate text-sm font-medium text-slate-600">{item.href}</p>
                  {item.openInNewTab && <p className="mt-1 text-xs text-slate-400">Buka tab baru</p>}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.displayOrder}</td>
                <td className="px-6 py-4">
                  <AdminInlineStatus tone={item.isActive ? 'green' : 'slate'}>
                    {item.isActive ? 'Aktif' : 'Nonaktif'}
                  </AdminInlineStatus>
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
            ))}
            {widgets.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-slate-400">Belum ada widget. Klik "Tambah Widget" untuk mulai.</td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableCard>

      {isModalOpen && (
        <AdminModal eyebrow="Widget Website" title={editingItem ? 'Edit Floating Widget' : 'Tambah Floating Widget'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-4xl">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {formError && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-lg bg-slate-50 p-4">
                <ImageUploadField
                  id="floating-widget-image"
                  label="Logo / Gambar"
                  value={formData.imageUrl}
                  onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                  previewAlt="Preview logo widget"
                  aspectClass="aspect-square"
                  compact
                />
                <p className="mt-3 text-xs leading-5 text-slate-500">Kosongkan gambar jika ingin memakai Material icon.</p>
              </div>
              <AdminFormSection icon="widgets" title="Informasi Widget" description="Nama widget akan dipakai sebagai teks hover di website.">
                <div className="space-y-4">
                  <AdminField label="Nama Widget">
                    <AdminTextInput
                      required
                      value={formData.label}
                      onChange={(event) => setFormData({ ...formData, label: event.target.value })}
                      placeholder="Contoh: Laporsemar"
                    />
                  </AdminField>
                  <AdminField label="URL Tujuan">
                    <AdminTextInput
                      required
                      value={formData.href}
                      onChange={(event) => handleHrefChange(event.target.value)}
                      placeholder="https://contoh.go.id atau /contact"
                    />
                  </AdminField>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AdminField label="Icon Material">
                      <AdminTextInput
                        value={formData.icon}
                        onChange={(event) => setFormData({ ...formData, icon: event.target.value })}
                        placeholder="Contoh: forum"
                        disabled={Boolean(formData.imageUrl)}
                      />
                    </AdminField>
                    <AdminField label="Urutan Tampil">
                      <AdminTextInput
                        type="number"
                        value={formData.displayOrder}
                        onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })}
                      />
                    </AdminField>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Aktifkan widget
                    </label>
                    <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.openInNewTab}
                        onChange={(event) => setFormData({ ...formData, openInNewTab: event.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Buka di tab baru
                    </label>
                  </div>
                </div>
              </AdminFormSection>
            </div>
            <AdminModalActions>
              <AdminButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Batal</AdminButton>
              <AdminButton type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {editingItem ? 'Simpan Perubahan' : 'Tambah Widget'}
              </AdminButton>
            </AdminModalActions>
          </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus widget?"
          description={`Widget "${deleteTarget.label}" akan dihapus dari website.`}
          confirmText="Hapus Widget"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
