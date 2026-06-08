import { useMemo, useState } from 'react';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCreateEmployee, useDeleteEmployee, useEmployees, useUpdateEmployee } from '../../hooks/useEmployees';
import { AdminButton, AdminConfirmDialog, AdminField, AdminFormSection, AdminModal, AdminModalActions, AdminPageHeader, AdminSelect, AdminTableCard, AdminTextarea, AdminTextInput } from '../../components/admin/AdminUI';

const emptyForm = {
  name: '',
  position: '',
  quote: '',
  imageUrl: '',
  imageAlt: '',
  displayOrder: 0,
  isActive: true,
};



const EMPLOYEE_POSITIONS = [
  'Kepala Bagian Pengadaan Barang/Jasa',
  'Analis Kebijakan Ahli Muda',
  'Pengelola Pengadaan Barang/Jasa Ahli Muda',
  'Pengelola Pengadaan Barang/Jasa Ahli Pertama',
  'Pengadministrasi Umum',
  'Operator Layanan Pengadaan Secara Elektronik',
];

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 data' },
  { value: 20, label: '20 data' },
  { value: 50, label: '50 data' },
  { value: 'all', label: 'Semua data' },
];

export default function AdminEmployees() {
  const { data: employees = [], isLoading } = useEmployees();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredEmployees = useMemo(() => employees.filter((item) => {
    if (!normalizedSearch) return true;
    return [item.name, item.position, item.imageAlt, item.displayOrder, item.isActive ? 'aktif' : 'nonaktif']
      .some((value) => String(value || '').toLowerCase().includes(normalizedSearch));
  }), [employees, normalizedSearch]);
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedEmployees = pageSize === 'all'
    ? filteredEmployees
    : filteredEmployees.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
  const firstItem = filteredEmployees.length === 0 || pageSize === 'all' ? (filteredEmployees.length ? 1 : 0) : ((safeCurrentPage - 1) * pageSize) + 1;
  const lastItem = pageSize === 'all' ? filteredEmployees.length : Math.min(safeCurrentPage * pageSize, filteredEmployees.length);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setFormData({ ...emptyForm, position: '', displayOrder: employees.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      name: item.name || '',
      position: item.position || '',
      quote: item.quote || '',
      imageUrl: item.imageUrl || '',
      imageAlt: item.imageAlt || '',
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const requiredFields = [
      ['Nama Pegawai', formData.name],
      ['Jabatan', formData.position],
      ['Foto Pegawai', formData.imageUrl],
    ];
    const emptyField = requiredFields.find(([, value]) => !String(value || '').trim());

    if (emptyField) {
      setFormError(`${emptyField[0]} wajib diisi sebelum menyimpan pegawai.`);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Memuat data pegawai...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Profil Instansi"
        title="Kelola Profil Pegawai"
        actions={<AdminButton onClick={openCreateModal} icon="add">Tambah Pegawai</AdminButton>}
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
          <AdminTextInput
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama, jabatan, status, atau urutan"
            className="pl-10"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <p className="text-sm font-medium text-slate-500">
            Menampilkan {firstItem}-{lastItem} dari {filteredEmployees.length} pegawai
          </p>
          <div className="w-full sm:w-40">
            <AdminSelect
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              options={PAGE_SIZE_OPTIONS}
              size="sm"
            />
          </div>
        </div>
      </div>

      <AdminTableCard>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Pegawai</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Jabatan</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Urutan</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEmployees.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt="" className="h-12 w-9 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="max-w-xs truncate font-semibold text-slate-800">{item.name}</p>
                        <p className="max-w-xs truncate text-xs text-slate-400">{item.imageAlt || 'Tanpa alt text'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.position}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.displayOrder}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
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
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                    {employees.length === 0 ? 'Belum ada data pegawai. Klik "Tambah Pegawai" untuk mulai.' : 'Tidak ada pegawai yang cocok dengan pencarian.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </AdminTableCard>

      {filteredEmployees.length > 0 && pageSize !== 'all' && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-500">
            Halaman {safeCurrentPage} dari {totalPages}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AdminModal eyebrow="Data Pegawai" title={editingItem ? 'Edit Profil Pegawai' : 'Tambah Profil Pegawai'} onClose={() => setIsModalOpen(false)} maxWidth="max-w-5xl">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {formError && (
                <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
                <div className="rounded-lg bg-slate-50 p-4">
                  <ImageUploadField
                    id="employee-image"
                    label="Foto Pegawai"
                    value={formData.imageUrl}
                    onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                    required
                    previewAlt={formData.name || 'Preview foto pegawai'}
                    aspectClass="aspect-[3/4]"
                    compact
                  />
                  <p className="mt-4 rounded-lg bg-white px-4 py-3 text-xs font-medium leading-relaxed text-slate-500">
                    Gunakan foto formal dengan rasio 3:4 agar tampilan kartu pegawai tetap rapi.
                  </p>
                </div>

                <div className="space-y-5">
                  <AdminFormSection icon="badge" title="Informasi Utama" description="Nama dan jabatan yang tampil di halaman profil.">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <AdminField label="Nama Pegawai">
                        <AdminTextInput
                          type="text"
                          required
                          value={formData.name}
                          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                          placeholder="Tulis nama pegawai"
                        />
                      </AdminField>
                      <AdminField label="Jabatan">
                        <AdminSelect
                          value={formData.position}
                          onChange={(position) => setFormData({ ...formData, position })}
                          options={EMPLOYEE_POSITIONS}
                          placeholder="Pilih jabatan pegawai"
                          searchable
                          searchPlaceholder="Cari jabatan..."
                        />
                      </AdminField>
                    </div>
                  </AdminFormSection>

                  <AdminFormSection icon="tune" title="Pengaturan Tampilan" description="Atur aksesibilitas foto, urutan, dan status tampil.">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <AdminField label="Alt Text Foto">
                        <AdminTextInput
                          type="text"
                          value={formData.imageAlt}
                          onChange={(event) => setFormData({ ...formData, imageAlt: event.target.value })}
                          placeholder="Tulis deskripsi singkat foto"
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
                    <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                      <span>
                        <span className="block text-sm font-medium text-slate-800">Tampilkan di halaman profil</span>
                        <span className="block text-xs font-medium text-slate-500">Nonaktifkan jika data pegawai belum siap dipublikasikan.</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                        className="h-5 w-5 rounded text-primary focus:ring-primary"
                      />
                    </label>
                  </AdminFormSection>
                </div>
              </div>

              <AdminModalActions>
                <AdminButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Batal</AdminButton>
                <AdminButton type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Pegawai'}
                </AdminButton>
              </AdminModalActions>
            </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminConfirmDialog
          title="Hapus pegawai?"
          description={`Data "${deleteTarget.name}" akan dihapus permanen dari halaman profil.`}
          confirmText="Hapus Pegawai"
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
