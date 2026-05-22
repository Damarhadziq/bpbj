import { useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCreateServiceLink, useDeleteServiceLink, useServiceLinks, useUpdateServiceLink } from '../../hooks/useServiceLinks';

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

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tautan layanan ini?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Memuat tautan layanan...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Layanan Lainnya</h1>
          <p className="mt-1 text-slate-500">Kelola logo dan link layanan yang tampil di beranda.</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-primary/90">
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Layanan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {links.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex aspect-[5/3] items-center justify-center bg-slate-50 p-5">
              <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="line-clamp-1 text-sm font-semibold text-slate-700">{item.linkUrl}</p>
                <p className="mt-1 text-xs text-slate-400">Urutan {item.displayOrder}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(item)} className="flex-1 rounded-lg bg-blue-50 py-2 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <span className="material-symbols-outlined mb-3 text-5xl opacity-30">widgets</span>
            <p>Belum ada layanan. Klik "Tambah Layanan" untuk mulai.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-8 py-5">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-8">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}
              <ImageUploadField
                id="service-link-image"
                label="Logo / Gambar"
                value={formData.imageUrl}
                onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                required
                previewAlt="Preview logo layanan"
              />
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Link URL</label>
                <input
                  type="url"
                  required
                  value={formData.linkUrl}
                  onChange={(event) => setFormData({ ...formData, linkUrl: event.target.value })}
                  placeholder="https://contoh.go.id"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Urutan Tampil</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
