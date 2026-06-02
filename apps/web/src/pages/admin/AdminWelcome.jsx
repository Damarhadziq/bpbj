import { useEffect, useMemo, useState } from 'react';
import { useWelcomeMessage, useUpdateWelcomeMessage } from '../../hooks/useWelcome';
import { useSession } from '../../lib/authClient';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { AdminButton, AdminConfirmDialog, AdminField, AdminFormSection, AdminPageHeader, AdminTextarea, AdminTextInput } from '../../components/admin/AdminUI';

export default function AdminWelcome() {
  const { data: welcomeMessage, isLoading } = useWelcomeMessage();

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data sambutan...</div>;
  }

  return <AdminWelcomeForm key={welcomeMessage?.updatedAt || 'empty'} welcomeMessage={welcomeMessage} />;
}

function AdminWelcomeForm({ welcomeMessage }) {
  const { data: session } = useSession();
  const updateMutation = useUpdateWelcomeMessage();
  const canEditWelcome = session?.user?.role === 'superadmin';
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(canEditWelcome && !welcomeMessage?.name && !welcomeMessage?.message);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const initialData = useMemo(() => ({
    name: welcomeMessage?.name || '',
    position: welcomeMessage?.position || '',
    message: welcomeMessage?.message || '',
    imageUrl: welcomeMessage?.imageUrl || '',
  }), [welcomeMessage]);
  const [formData, setFormData] = useState(() => ({
    name: welcomeMessage?.name || '',
    position: welcomeMessage?.position || '',
    message: welcomeMessage?.message || '',
    imageUrl: welcomeMessage?.imageUrl || '',
  }));
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  useEffect(() => {
    window.__adminHasUnsavedChanges = () => isEditing && hasChanges;
    window.__adminClearUnsavedChanges = () => {
      setIsEditing(false);
      setFormData(initialData);
    };

    return () => {
      delete window.__adminHasUnsavedChanges;
      delete window.__adminClearUnsavedChanges;
    };
  }, [hasChanges, initialData, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEditWelcome || !isEditing || !hasChanges) return;
    setIsSaveConfirmOpen(true);
  };

  const confirmSave = async () => {
    if (!canEditWelcome) return;
    await updateMutation.mutateAsync(formData);
    setIsSaveConfirmOpen(false);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cancelEdit = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Konten Beranda"
        title="Kelola Sambutan Kepala"
      />

      {/* Form */}
      <div className="rounded-lg bg-white">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
          <div className="rounded-lg bg-slate-50 p-4">
            <ImageUploadField
              id="welcome-image"
              label="Upload Foto"
              value={formData.imageUrl}
              onChange={(imageUrl) => setFormData({...formData, imageUrl})}
              previewAlt={formData.position || 'Preview foto kepala'}
              aspectClass="aspect-[3/4]"
              disabled={!canEditWelcome || !isEditing}
              compact
            />
          </div>
          <div className="space-y-6">
            <AdminFormSection
              icon="campaign"
              title="Informasi Sambutan"
              description={
                !canEditWelcome
                  ? 'Mode baca aktif. Perubahan sambutan hanya dapat dilakukan oleh superadmin.'
                  : isEditing
                    ? 'Perbarui data dengan hati-hati karena konten ini tampil di beranda.'
                    : 'Mode baca aktif. Klik Edit Sambutan untuk mengubah konten.'
              }
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <AdminField label="Nama Kepala">
                  <AdminTextInput type="text" required disabled={!canEditWelcome || !isEditing} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Tulis nama kepala BPBJ" className={!isEditing ? 'bg-slate-50 text-slate-500' : ''} />
                </AdminField>
                <AdminField label="Jabatan">
                  <AdminTextInput type="text" required disabled={!canEditWelcome || !isEditing} value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="Tulis jabatan kepala BPBJ" className={!isEditing ? 'bg-slate-50 text-slate-500' : ''} />
                </AdminField>
              </div>
              <div className="mt-5">
                <AdminField label="Teks Sambutan">
                  <AdminTextarea required disabled={!canEditWelcome || !isEditing} rows={10} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tuliskan teks sambutan kepala BPBJ..." className={!isEditing ? 'bg-slate-50 text-slate-500' : ''} />
                </AdminField>
              </div>
            </AdminFormSection>
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton type="submit" disabled={!canEditWelcome || !isEditing || !hasChanges || updateMutation.isPending}>
              {updateMutation.isPending && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Ajukan Simpan
            </AdminButton>
            {canEditWelcome && (
              isEditing ? (
                <button type="button" onClick={cancelEdit} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                  Batalkan Edit
                </button>
              ) : (
                <AdminButton type="button" variant="neutral" icon="edit" onClick={() => setIsEditing(true)}>
                  Edit Sambutan
                </AdminButton>
              )
            )}
            {!canEditWelcome && (
              <span className="text-sm font-medium text-slate-500">Hanya superadmin yang dapat mengubah sambutan.</span>
            )}
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Tersimpan!
              </span>
            )}
          </div>
          </div>
        </form>
      </div>

      {isSaveConfirmOpen && (
        <AdminConfirmDialog
          eyebrow="Konfirmasi Konten Sensitif"
          title="Simpan perubahan sambutan?"
          description="Sambutan kepala tampil di halaman utama website. Pastikan nama, jabatan, foto, dan isi sambutan sudah benar sebelum dipublikasikan."
          confirmText="Ya, simpan sambutan"
          cancelText="Periksa lagi"
          icon="verified"
          tone="amber"
          isLoading={updateMutation.isPending}
          onCancel={() => setIsSaveConfirmOpen(false)}
          onConfirm={confirmSave}
        />
      )}
    </div>
  );
}
