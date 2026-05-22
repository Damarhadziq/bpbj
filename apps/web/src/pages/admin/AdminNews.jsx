import { useState } from 'react';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '../../hooks/useNews';
import { useSession } from '../../lib/authClient';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { NEWS_CATEGORIES } from '../../constants/categories';
import { generateSummary } from '../../utils/summary';

const DEFAULT_NEWS_CATEGORY = NEWS_CATEGORIES[0];

export default function AdminNews() {
  const { data: session } = useSession();
  const { data: newsData = [], isLoading } = useNews();
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '', slug: '', category: DEFAULT_NEWS_CATEGORY, date: '', summary: '', content: '', imageUrl: '', isFeatured: false,
  });
  const toInputDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setFormData({ title: '', slug: '', category: DEFAULT_NEWS_CATEGORY, date: toInputDate(), summary: '', content: '', imageUrl: '', isFeatured: false });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      title: item.title, slug: item.slug, category: item.category, summary: item.summary,
      date: toInputDate(item.date), content: item.content, imageUrl: item.imageUrl || '', isFeatured: item.isFeatured,
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

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data berita...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Berita</h1>
          <p className="text-slate-500 mt-1">Total {newsData.length} berita.</p>
        </div>
        <button onClick={openCreateModal} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Berita
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Utama</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsData.map((item) => (
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
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(item.date)}</td>
                  <td className="px-6 py-4">
                    {item.isFeatured ? (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">⭐ Utama</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {newsData.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-400">Belum ada berita. Klik "Tambah Berita" untuk mulai.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug (opsional, auto-generated)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
                  placeholder="contoh: judul-berita-terbaru"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    {NEWS_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-sm font-semibold text-slate-700">Berita Utama</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Berita/Kegiatan</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <ImageUploadField
                id="news-image"
                label="Upload Gambar"
                value={formData.imageUrl}
                onChange={(imageUrl) => setFormData({...formData, imageUrl})}
                required
                previewAlt={formData.title || 'Preview gambar berita'}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konten</label>
                <textarea required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
