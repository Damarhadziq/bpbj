import { useMemo, useState } from 'react';
import { useCreateRegulation, useDeleteRegulation, useRegulations, useUpdateRegulation } from '../../hooks/useRegulations';
import { AdminButton, AdminConfirmDialog, AdminField, AdminFormSection, AdminInlineStatus, AdminModal, AdminModalActions, AdminPageHeader, AdminSelect, AdminTableCard, AdminTextarea, AdminTextInput } from '../../components/admin/AdminUI';

const emptyForm = {
  title: '',
  category: 'Peraturan Presiden',
  description: '',
  linkUrl: '',
  displayOrder: 0,
  isActive: true,
};

const categoryOptions = [
  { value: 'Peraturan Presiden', label: 'Peraturan Presiden' },
  { value: 'Peraturan LKPP', label: 'Peraturan LKPP' },
  { value: 'Keputusan LKPP', label: 'Keputusan LKPP' },
  { value: 'Peraturan Daerah', label: 'Peraturan Daerah' },
  { value: 'Peraturan Walikota', label: 'Peraturan Walikota' },
  { value: 'Lainnya', label: 'Lainnya' },
];

export default function AdminRegulations() {
  const { data: regulations = [], isLoading } = useRegulations();
  const createMutation = useCreateRegulation();
  const updateMutation = useUpdateRegulation();
  const deleteMutation = useDeleteRegulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const filteredRegulations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return regulations;
    return regulations.filter((item) => (
      [item.title, item.category, item.description].some((value) => String(value || '').toLowerCase().includes(keyword))
    ));
  }, [regulations, searchTerm]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm, displayOrder: regulations.length + 1 });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Peraturan Presiden',
      description: item.description || '',
      linkUrl: item.linkUrl || '',
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive !== false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.category.trim() || !formData.description.trim()) {
      setFormError('Nomor/judul regulasi, kategori, dan isi regulasi wajib diisi.');
      return;
    }

    if (formData.linkUrl.trim() && !/^https?:\/\/[^\s]+$/i.test(formData.linkUrl.trim())) {
      setFormError('Link resmi harus diawali http:// atau https://.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      linkUrl: formData.linkUrl.trim() || null,
      displayOrder: Number(formData.displayOrder) || 0,
      isActive: Boolean(formData.isActive),
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
    return <div className="py-20 text-center text-slate-400">Memuat regulasi...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Profil BPBJ"
        title="Kelola Regulasi"
        description="Tambahkan peraturan, turunan, dan link resmi yang tampil pada halaman profil."
        actions={<AdminButton onClick={openCreateModal} icon="add">Tambah Regulasi</AdminButton>}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
          <AdminTextInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari regulasi"
            className="pl-10"
          />
        </div>
      </div>

      <AdminTableCard>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Regulasi</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Kategori</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Link</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRegulations.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 max-w-2xl truncate text-sm text-slate-500">{item.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                <td className="px-6 py-4">
                  {item.linkUrl ? (
                    <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-xs items-center gap-1 truncate text-sm font-medium text-primary hover:underline">
                      Link resmi
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">Belum ada</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <AdminInlineStatus tone={item.isActive ? 'green' : 'slate'}>{item.isActive ? 'Tampil' : 'Draft'}</AdminInlineStatus>
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
            {filteredRegulations.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                  {regulations.length === 0 ? 'Belum ada regulasi. Klik "Tambah Regulasi" untuk mulai.' : 'Tidak ada regulasi yang cocok dengan pencarian.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableCard>

      {isModalOpen && (
        <AdminModal eyebrow="Profil BPBJ" title={editingItem ? 'Edit Regulasi' : 'Tambah Regulasi'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {formError}
              </div>
            )}
            <AdminFormSection icon="gavel" title="Informasi Regulasi" description="Isi nomor regulasi, ringkasan, dan tautan resmi jika tersedia.">
              <div className="space-y-4">
                <AdminField label="Nomor / Judul Regulasi">
                  <AdminTextInput
                    required
                    value={formData.title}
                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    placeholder="Contoh: Perpres Nomor 46 Tahun 2025"
                  />
                </AdminField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Kategori">
                    <AdminSelect
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(value) => setFormData({ ...formData, category: value })}
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
                <AdminField label="Isi / Keterangan Regulasi">
                  <AdminTextarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    placeholder="Tulis ringkasan isi peraturan atau turunan regulasi."
                  />
                </AdminField>
                <AdminField label="Link Resmi">
                  <AdminTextInput
                    type="url"
                    value={formData.linkUrl}
                    onChange={(event) => setFormData({ ...formData, linkUrl: event.target.value })}
                    placeholder="https://peraturan.bpk.go.id/..."
                  />
                </AdminField>
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">Tampilkan di profil</span>
                    <span className="block text-xs text-slate-500">Nonaktifkan jika regulasi belum siap dipublikasikan.</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </AdminFormSection>
            <AdminModalActions>
              <AdminButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Batal</AdminButton>
              <AdminButton type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {editingItem ? 'Simpan Perubahan' : 'Tambah Regulasi'}
              </AdminButton>
            </AdminModalActions>
          </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus regulasi?"
          description={`Regulasi "${deleteTarget.title}" akan dihapus dari halaman profil.`}
          confirmText="Hapus Regulasi"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
