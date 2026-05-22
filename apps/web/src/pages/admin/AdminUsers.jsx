import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useCreateUser, useUpdateUserRole, useDeleteUser, useChangeUserPassword, useChangeOwnPassword } from '../../hooks/useUsers';
import { signOut, useSession } from '../../lib/authClient';

function PasswordInput({ value, onChange, placeholder = '', autoComplete = 'new-password' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={isVisible ? 'text' : 'password'}
        required
        minLength={8}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-primary"
        aria-label={isVisible ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        <span className="material-symbols-outlined text-[20px]">{isVisible ? 'visibility_off' : 'visibility'}</span>
      </button>
    </div>
  );
}

export default function AdminUsers() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useUsers();
  const createMutation = useCreateUser();
  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();
  const changePasswordMutation = useChangeUserPassword();
  const changeOwnPasswordMutation = useChangeOwnPassword();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOwnPasswordModalOpen, setIsOwnPasswordModalOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: '',
    confirmationText: '',
  });
  const [ownPasswordForm, setOwnPasswordForm] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openOwnPasswordModal = () => {
    setOwnPasswordForm({ currentPassword: '', password: '', confirmPassword: '' });
    setFormError('');
    setIsOwnPasswordModalOpen(true);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      await createMutation.mutateAsync(formData);
      setIsModalOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Gagal menambahkan admin.');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (window.confirm(`Ubah role pengguna ini menjadi "${newRole}"?`)) {
      await updateRoleMutation.mutateAsync({ id, role: newRole });
    }
  };

  const openPasswordModal = (user) => {
    setPasswordTarget(user);
    setPasswordForm({ password: '', confirmPassword: '', confirmationText: '' });
    setFormError('');
  };

  const openDeleteModal = (user) => {
    setDeleteTarget(user);
    setDeleteConfirmation('');
    setFormError('');
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      await changePasswordMutation.mutateAsync({
        id: passwordTarget.id,
        data: passwordForm,
      });
      setPasswordTarget(null);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Gagal mengubah password admin.');
    }
  };

  const handleChangeOwnPassword = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      await changeOwnPasswordMutation.mutateAsync(ownPasswordForm);
      setIsOwnPasswordModalOpen(false);
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      setFormError(error.response?.data?.error || 'Gagal mengubah password superadmin.');
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      await deleteMutation.mutateAsync({
        id: deleteTarget.id,
        data: { confirmationText: deleteConfirmation },
      });
      setDeleteTarget(null);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Gagal menghapus admin.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const roleColors = {
    superadmin: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data pengguna...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Akun</h1>
          <p className="text-slate-500 mt-1">Total {users.length} pengguna terdaftar. Hanya <strong>superadmin</strong> yang dapat mengakses halaman ini.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button onClick={openOwnPasswordModal} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">lock_reset</span>
            Ubah Password Saya
          </button>
          <button onClick={openCreateModal} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Tambah Admin
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aktivitas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isSelf = user.id === session?.user?.id;
                return (
                  <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${isSelf ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name}
                            {isSelf && <span className="ml-2 text-[10px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">(Anda)</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      {isSelf ? (
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${roleColors[user.role] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {user.role}
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer outline-none ${roleColors[user.role] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
                        >
                          <option value="admin">admin</option>
                          <option value="superadmin">superadmin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      <p>Dibuat: {formatDate(user.createdAt)}</p>
                      <p className="text-xs text-slate-400">Update: {formatDate(user.updatedAt || user.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isSelf && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openPasswordModal(user)}
                            disabled={user.role !== 'admin'}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            title="Ubah Password"
                          >
                            <span className="material-symbols-outlined text-[18px]">key</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            disabled={user.role !== 'admin'}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            title="Hapus Admin"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3 opacity-30">group</span>
                  <p>Belum ada pengguna terdaftar.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Tambah Admin Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-5">
              {formError && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <PasswordInput
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                />
                <p className="mt-2 text-xs text-slate-400">Minimal 8 karakter. Akun baru otomatis dibuat sebagai admin.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {createMutation.isPending && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  Tambah Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOwnPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsOwnPasswordModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Ubah Password Saya</h2>
              <button onClick={() => setIsOwnPasswordModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleChangeOwnPassword} className="p-8 space-y-5">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                Setelah password diganti, semua sesi akun Anda akan dikeluarkan dan Anda harus login ulang.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Saat Ini</label>
                <PasswordInput
                  value={ownPasswordForm.currentPassword}
                  autoComplete="current-password"
                  onChange={(event) => setOwnPasswordForm({ ...ownPasswordForm, currentPassword: event.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Baru</label>
                <PasswordInput
                  value={ownPasswordForm.password}
                  onChange={(event) => setOwnPasswordForm({ ...ownPasswordForm, password: event.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Password Baru</label>
                <PasswordInput
                  value={ownPasswordForm.confirmPassword}
                  onChange={(event) => setOwnPasswordForm({ ...ownPasswordForm, confirmPassword: event.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOwnPasswordModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={changeOwnPasswordMutation.isPending} className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors disabled:opacity-50">
                  {changeOwnPasswordMutation.isPending ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPasswordTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Ubah Password Admin</h2>
              <button onClick={() => setPasswordTarget(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-8 space-y-5">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Password untuk <strong>{passwordTarget.email}</strong> akan diganti dan sesi aktif akun tersebut akan dikeluarkan.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Baru</label>
                <PasswordInput
                  value={passwordForm.password}
                  onChange={(event) => setPasswordForm({ ...passwordForm, password: event.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Password</label>
                <PasswordInput
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ketik email admin untuk konfirmasi</label>
                <input
                  type="text"
                  required
                  value={passwordForm.confirmationText}
                  onChange={(event) => setPasswordForm({ ...passwordForm, confirmationText: event.target.value })}
                  placeholder={passwordTarget.email}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setPasswordTarget(null)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={changePasswordMutation.isPending} className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
                  Ubah Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Hapus Admin</h2>
              <button onClick={() => setDeleteTarget(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleDelete} className="p-8 space-y-5">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Akun <strong>{deleteTarget.email}</strong> akan dihapus permanen. Tindakan ini hanya diizinkan untuk akun admin.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ketik email admin untuk konfirmasi</label>
                <input
                  type="text"
                  required
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder={deleteTarget.email}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" disabled={deleteMutation.isPending} className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                  Hapus Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
