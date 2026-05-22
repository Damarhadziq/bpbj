import { useState } from 'react';
import { useWelcomeMessage, useUpdateWelcomeMessage } from '../../hooks/useWelcome';
import ImageUploadField from '../../components/admin/ImageUploadField';

export default function AdminWelcome() {
  const { data: welcomeMessage, isLoading } = useWelcomeMessage();

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data sambutan...</div>;
  }

  return <AdminWelcomeForm key={welcomeMessage?.updatedAt || 'empty'} welcomeMessage={welcomeMessage} />;
}

function AdminWelcomeForm({ welcomeMessage }) {
  const updateMutation = useUpdateWelcomeMessage();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: welcomeMessage?.name || '',
    position: welcomeMessage?.position || '',
    message: welcomeMessage?.message || '',
    imageUrl: welcomeMessage?.imageUrl || '',
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Sambutan Kepala</h1>
        <p className="text-slate-500 mt-1">Kelola teks sambutan dan foto kepala BPBJ yang ditampilkan di halaman utama.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kepala</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Drs. H. Ahmad Syafrudin, M.Si."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jabatan</label>
              <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
                placeholder="Kepala BPBJ Kota Semarang"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
          </div>
          <ImageUploadField
            id="welcome-image"
            label="Upload Foto"
            value={formData.imageUrl}
            onChange={(imageUrl) => setFormData({...formData, imageUrl})}
            previewAlt={formData.position || 'Preview foto kepala'}
          />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teks Sambutan</label>
            <textarea required rows={10} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="Tuliskan teks sambutan kepala BPBJ..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={updateMutation.isPending}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
              {updateMutation.isPending && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Simpan Perubahan
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Tersimpan!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
