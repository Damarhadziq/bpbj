import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useCreateUser, useUpdateUserRole, useDeleteUser, useChangeUserPassword, useChangeOwnPassword } from '../../hooks/useUsers';
import { signOut, useSession } from '../../lib/authClient';
import { AdminButton, AdminConfirmDialog, AdminModal, AdminPageHeader, AdminSelect, AdminTableCard, AdminTextInput } from '../../components/admin/AdminUI';

function UserAvatar({ user, size = 'sm' }) {
  const sizes = {
    sm: 'h-9 w-9 text-sm',
    lg: 'h-14 w-14 text-lg',
  };
  const sizeClassName = sizes[size] || sizes.sm;

  if (user.image) {
    return (
      <img
        src={user.image}
        alt=""
        className={`${sizeClassName} flex-shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClassName} flex flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary`}>
      {user.name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
}

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
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 pr-12 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
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
  const [roleTarget, setRoleTarget] = useState(null);
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
    const targetUser = users.find((user) => user.id === id);
    setRoleTarget({ id, name: targetUser?.name || 'Pengguna', email: targetUser?.email || '', role: newRole });
  };

  const confirmRoleChange = async () => {
    await updateRoleMutation.mutateAsync({ id: roleTarget.id, role: roleTarget.role });
    setRoleTarget(null);
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
  const roleOptions = ['admin', 'superadmin'];
  const superadmins = users.filter((user) => user.role === 'superadmin');
  const adminUsers = users.filter((user) => user.role !== 'superadmin');

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data pengguna...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Keamanan"
        title="Kelola Akun Admin"
        actions={<AdminButton onClick={openCreateModal} icon="person_add">Tambah Admin</AdminButton>}
      />

      {superadmins.length > 0 && (
        <section className="mb-6">
          <div className="mb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Profil Superadmin</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Akses Pengelola Utama</h2>
          </div>
          <div className="grid gap-4">
            {superadmins.map((user) => {
              const isSelf = user.id === session?.user?.id;
              return (
                <article key={user.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <UserAvatar user={user} size="lg" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-xl font-semibold tracking-tight text-slate-950">{user.name}</h3>
                          {isSelf && <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-primary">Anda</span>}
                          <span className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${roleColors[user.role] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {isSelf && (
                      <AdminButton onClick={openOwnPasswordModal} variant="neutral" icon="lock_reset" className="w-full sm:w-auto">
                        Ubah Password
                      </AdminButton>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <AdminTableCard>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Pengguna</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Aktivitas</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminUsers.map((user) => {
                const isSelf = user.id === session?.user?.id;
                return (
                  <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${isSelf ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name}
                            {isSelf && <span className="ml-2 text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded">(Anda)</span>}
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
                        <AdminSelect
                          value={user.role}
                          onChange={(role) => handleRoleChange(user.id, role)}
                          options={roleOptions}
                          size="sm"
                          className="w-32"
                          buttonClassName={`${roleColors[user.role] || 'bg-slate-50 text-slate-600 border-slate-200'} shadow-none`}
                        />
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
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            title="Ubah Password"
                          >
                            <span className="material-symbols-outlined text-[18px]">key</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            disabled={user.role !== 'admin'}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
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
              {adminUsers.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3 opacity-30">group</span>
                  <p>Belum ada akun admin terdaftar.</p>
                </td></tr>
              )}
            </tbody>
          </table>
      </AdminTableCard>

      {isModalOpen && (
        <AdminModal eyebrow="Keamanan" title="Tambah Admin Baru" onClose={() => setIsModalOpen(false)} maxWidth="max-w-lg">
            <form onSubmit={handleCreate} className="p-8 space-y-5">
              {formError && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama</label>
                <AdminTextInput
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="Tulis nama admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <AdminTextInput
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="Tulis email admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <PasswordInput
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder="Tulis password awal admin"
                />
                <p className="mt-2 text-xs text-slate-400">Minimal 8 karakter. Akun baru otomatis dibuat sebagai admin.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {createMutation.isPending && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  Tambah Admin
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {isOwnPasswordModalOpen && (
        <AdminModal eyebrow="Keamanan" title="Ubah Password Saya" onClose={() => setIsOwnPasswordModalOpen(false)} maxWidth="max-w-lg">
            <form onSubmit={handleChangeOwnPassword} className="p-8 space-y-5">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                Setelah password diganti, semua sesi akun Anda akan dikeluarkan dan Anda harus login ulang.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password Saat Ini</label>
                <PasswordInput
                  value={ownPasswordForm.currentPassword}
                  autoComplete="current-password"
                  onChange={(event) => setOwnPasswordForm({ ...ownPasswordForm, currentPassword: event.target.value })}
                  placeholder="Tulis password saat ini"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password Baru</label>
                <PasswordInput
                  value={ownPasswordForm.password}
                  onChange={(event) => setOwnPasswordForm({ ...ownPasswordForm, password: event.target.value })}
                  placeholder="Tulis password baru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password Baru</label>
                <PasswordInput
                  value={ownPasswordForm.confirmPassword}
                  onChange={(event) => setOwnPasswordForm({ ...ownPasswordForm, confirmPassword: event.target.value })}
                  placeholder="Ulangi password baru"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOwnPasswordModalOpen(false)} className="rounded-lg px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={changeOwnPasswordMutation.isPending} className="rounded-lg bg-slate-800 px-6 py-2.5 font-medium text-white transition-colors hover:bg-slate-900 disabled:opacity-50">
                  {changeOwnPasswordMutation.isPending ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {passwordTarget && (
        <AdminModal eyebrow="Keamanan" title="Ubah Password Admin" onClose={() => setPasswordTarget(null)} maxWidth="max-w-lg">
            <form onSubmit={handleChangePassword} className="p-8 space-y-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Password untuk <strong>{passwordTarget.email}</strong> akan diganti dan sesi aktif akun tersebut akan dikeluarkan.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password Baru</label>
                <PasswordInput
                  value={passwordForm.password}
                  onChange={(event) => setPasswordForm({ ...passwordForm, password: event.target.value })}
                  placeholder="Tulis password baru admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
                <PasswordInput
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
                  placeholder="Ulangi password baru admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ketik email admin untuk konfirmasi</label>
                <AdminTextInput
                  type="text"
                  required
                  value={passwordForm.confirmationText}
                  onChange={(event) => setPasswordForm({ ...passwordForm, confirmationText: event.target.value })}
                  placeholder={`Ketik ${passwordTarget.email}`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setPasswordTarget(null)} className="rounded-lg px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={changePasswordMutation.isPending} className="rounded-lg bg-amber-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50">
                  Ubah Password
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminModal eyebrow="Aksi Berisiko" title="Hapus Admin" onClose={() => setDeleteTarget(null)} maxWidth="max-w-lg">
            <form onSubmit={handleDelete} className="p-8 space-y-5">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Akun <strong>{deleteTarget.email}</strong> akan dihapus permanen. Tindakan ini hanya diizinkan untuk akun admin.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ketik email admin untuk konfirmasi</label>
                <AdminTextInput
                  type="text"
                  required
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder={`Ketik ${deleteTarget.email}`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={deleteMutation.isPending} className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50">
                  Hapus Admin
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {roleTarget && (
        <AdminConfirmDialog
          eyebrow="Perubahan Role"
          title="Ubah Role Pengguna?"
          description={`Akun ${roleTarget.name}${roleTarget.email ? ` (${roleTarget.email})` : ''} akan diubah menjadi ${roleTarget.role}. Pastikan perubahan akses ini sudah sesuai.`}
          confirmText="Ubah Role"
          cancelText="Batal"
          icon="manage_accounts"
          tone="amber"
          isLoading={updateRoleMutation.isPending}
          onCancel={() => setRoleTarget(null)}
          onConfirm={confirmRoleChange}
        />
      )}
    </div>
  );
}
