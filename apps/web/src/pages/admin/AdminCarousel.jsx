import { useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCarousel, useCreateCarousel, useUpdateCarousel, useDeleteCarousel } from '../../hooks/useCarousel';

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

  const handleDelete = async (item) => {
    if (window.confirm('Hapus carousel ini? Aksi ini tidak bisa dibatalkan.')) {
      await deleteMutation.mutateAsync(item.id);
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Carousel</h1>
          <p className="text-slate-500 mt-1">Kelola banner halaman utama, urutan tampil, dan status aktif.</p>
        </div>
        <button onClick={openCreateModal} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
          Tambah Carousel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {carouselItems.map((item) => (
          <article key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="aspect-video bg-slate-100">
              <img src={item.imageUrl} alt={item.imageAlt || 'Carousel image'} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-800 line-clamp-1">Carousel Image</h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.imageAlt || 'Tanpa alt text'}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                <p><span className="font-semibold text-slate-700">Urutan:</span> {item.displayOrder}</p>
                <p><span className="font-semibold text-slate-700">Dibuat:</span> {formatDate(item.createdAt)}</p>
                <p className="col-span-2"><span className="font-semibold text-slate-700">Diperbarui:</span> {formatDate(item.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(item)} className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                <button onClick={() => handleDelete(item)} className="py-2 px-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {carouselItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-3 opacity-30">view_carousel</span>
          <p>Belum ada carousel. Klik "Tambah Carousel" untuk mulai.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Carousel' : 'Tambah Carousel'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <ImageUploadField
                id="carousel-image"
                label="Upload Banner"
                value={formData.imageUrl}
                onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                required
                previewAlt={formData.imageAlt || 'Preview carousel'}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alt Text Gambar</label>
                  <input type="text" value={formData.imageAlt} onChange={(event) => setFormData({ ...formData, imageAlt: event.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urutan Tampil</label>
                  <input type="number" min="0" value={formData.displayOrder} onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-primary" />
                <span className="text-sm font-semibold text-slate-700">Aktif ditampilkan di halaman utama</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Carousel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
