import { useState } from 'react';
import { useGallery, useCreateGallery, useUpdateGallery, useDeleteGallery } from '../../hooks/useGallery';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { GALLERY_CATEGORIES } from '../../constants/categories';

const DEFAULT_GALLERY_CATEGORY = GALLERY_CATEGORIES[1];

export default function AdminGallery() {
  const { data: galleryData = [], isLoading } = useGallery();
  const createMutation = useCreateGallery();
  const updateMutation = useUpdateGallery();
  const deleteMutation = useDeleteGallery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '', category: DEFAULT_GALLERY_CATEGORY, location: '', date: '', description: '', imageUrl: '', imageAlt: '', isFeatured: false,
  });
  const toInputDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setFormData({ title: '', category: DEFAULT_GALLERY_CATEGORY, location: '', date: toInputDate(), description: '', imageUrl: '', imageAlt: '', isFeatured: false });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      title: item.title, category: item.category, location: item.location || '',
      date: toInputDate(item.date), description: item.description, imageUrl: item.imageUrl || '', imageAlt: item.imageAlt || '', isFeatured: item.isFeatured,
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
      ['Gambar', formData.imageUrl],
      ['Alt Text Gambar', formData.imageAlt],
      ['Deskripsi', formData.description],
    ];
    const emptyField = requiredFields.find(([, value]) => !String(value || '').trim());

    if (emptyField) {
      setFormError(`${emptyField[0]} wajib diisi sebelum menyimpan galeri.`);
      return;
    }

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
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
    return <div className="text-center py-20 text-slate-400">Memuat data galeri...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Galeri</h1>
          <p className="text-slate-500 mt-1">Total {galleryData.length} item.</p>
        </div>
        <button onClick={openCreateModal} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Galeri
        </button>
      </div>

      {/* Grid Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryData.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-5xl">image</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-sm">{item.category}</span>
              </div>
              {item.isFeatured && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg">⭐ Utama</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h4 className="font-bold text-slate-800 mb-1 line-clamp-1">{item.title}</h4>
              <p className="text-xs text-slate-400 mb-3">{formatDate(item.date)} {item.location && `• ${item.location}`}</p>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.description}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(item)} className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="py-2 px-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {galleryData.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-30">photo_library</span>
            <p>Belum ada galeri. Klik "Tambah Galeri" untuk mulai.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Galeri' : 'Tambah Galeri Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    {GALLERY_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lokasi</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="Contoh: Balai Kota Semarang"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Kegiatan</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <ImageUploadField
                id="gallery-image"
                label="Upload Gambar"
                value={formData.imageUrl}
                onChange={(imageUrl) => setFormData({...formData, imageUrl})}
                required
                previewAlt={formData.imageAlt || formData.title || 'Preview gambar galeri'}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alt Text Gambar</label>
                <input type="text" required value={formData.imageAlt} onChange={e => setFormData({...formData, imageAlt: e.target.value})}
                  placeholder="Deskripsi singkat gambar"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-5 h-5 text-primary rounded focus:ring-primary" />
                <span className="text-sm font-semibold text-slate-700">Tampilkan di halaman utama</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
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
