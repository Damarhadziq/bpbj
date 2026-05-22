import { useState } from 'react';
import { useContacts, useUpdateContactStatus, useDeleteContact } from '../../hooks/useContacts';

export default function AdminContacts() {
  const { data: contacts = [], isLoading } = useContacts();
  const updateStatusMutation = useUpdateContactStatus();
  const deleteMutation = useDeleteContact();
  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [formError, setFormError] = useState('');

  const handleStatusChange = async (id, newStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
  };

  const openDetails = async (contact) => {
    setDetailItem(contact);
    if (contact.status === 'UNREAD') {
      await updateStatusMutation.mutateAsync({ id: contact.id, status: 'READ' });
    }
  };

  const openDeleteModal = (contact) => {
    setDeleteItem(contact);
    setDeleteConfirmation('');
    setFormError('');
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      await deleteMutation.mutateAsync({
        id: deleteItem.id,
        data: { confirmationText: deleteConfirmation },
      });
      setDeleteItem(null);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Gagal menghapus pengaduan.');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusColors = {
    UNREAD: 'bg-red-50 text-red-700 border-red-200',
    READ: 'bg-blue-50 text-blue-700 border-blue-200',
    REPLIED: 'bg-green-50 text-green-700 border-green-200',
  };

  const statusLabels = {
    UNREAD: 'Belum Dibaca',
    READ: 'Sudah Dibaca',
    REPLIED: 'Sudah Dibalas',
  };

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data pengaduan...</div>;
  }

  const unreadCount = contacts.filter((contact) => contact.status === 'UNREAD').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pengaduan Masuk</h1>
          <p className="text-slate-500 mt-1">
            Total {contacts.length} pengaduan
            {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">{unreadCount} belum dibaca</span>}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengirim</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subjek</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pesan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className={`hover:bg-slate-50/50 transition-colors ${contact.status === 'UNREAD' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{contact.name}</p>
                    <p className="text-xs text-slate-400">{contact.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[150px] truncate">{contact.subject || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-[250px]">
                    <p className="line-clamp-2">{contact.message}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    <p>{formatDate(contact.createdAt)}</p>
                    <p className="text-xs text-slate-400">Update: {formatDate(contact.updatedAt || contact.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={contact.status}
                      onChange={(event) => handleStatusChange(contact.id, event.target.value)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer outline-none ${statusColors[contact.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
                    >
                      <option value="UNREAD">{statusLabels.UNREAD}</option>
                      <option value="READ">{statusLabels.READ}</option>
                      <option value="REPLIED">{statusLabels.REPLIED}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openDetails(contact)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail Pengaduan">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact)}
                        disabled={!['READ', 'REPLIED'].includes(contact.status)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        title="Hapus Pengaduan"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-3 opacity-30">forum</span>
                    <p>Belum ada pengaduan masuk.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Detail Pengaduan</h2>
              <button onClick={() => setDetailItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Nama</p>
                  <p className="font-semibold text-slate-800">{detailItem.name}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                  <a href={`mailto:${detailItem.email}`} className="font-semibold text-primary break-all">{detailItem.email}</a>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dikirim</p>
                  <p className="font-semibold text-slate-800">{formatDate(detailItem.createdAt)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Terakhir Update</p>
                  <p className="font-semibold text-slate-800">{formatDate(detailItem.updatedAt || detailItem.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subjek</p>
                <p className="text-lg font-bold text-slate-800">{detailItem.subject || 'Tanpa subjek'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Isi Pengaduan</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {detailItem.message}
                </div>
              </div>
              <div className="flex justify-end">
                <a href={`mailto:${detailItem.email}?subject=Re: ${detailItem.subject || 'Pengaduan BPBJ Kota Semarang'}`} className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  Balas via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Hapus Pengaduan</h2>
              <button onClick={() => setDeleteItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleDelete} className="p-8 space-y-5">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Pengaduan dari <strong>{deleteItem.name}</strong> akan dihapus permanen. Pengaduan hanya bisa dihapus setelah berstatus sudah dibaca atau sudah dibalas.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ketik DELETE untuk konfirmasi</label>
                <input
                  type="text"
                  required
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDeleteItem(null)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={deleteMutation.isPending} className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                  Hapus Pengaduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
