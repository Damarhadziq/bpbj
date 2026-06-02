import { useMemo, useState } from 'react';
import { useContacts, useUpdateContactStatus, useDeleteContact, useReplyContact } from '../../hooks/useContacts';
import { AdminButton, AdminModal, AdminPageHeader, AdminSelect, AdminTableCard, AdminTextarea, AdminTextInput } from '../../components/admin/AdminUI';

const CONTACT_STATUS_ALL = 'ALL';
const CONTACT_SUBJECT_ALL = 'ALL_SUBJECTS';
const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 data' },
  { value: 20, label: '20 data' },
  { value: 50, label: '50 data' },
  { value: 'all', label: 'Semua data' },
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
];
const STATUS_LABELS = {
  UNREAD: 'Belum Dibaca',
  READ: 'Sudah Dibaca',
  REPLIED: 'Sudah Dibalas',
};
const REPLY_TEMPLATES = [
  {
    label: 'Pembuka',
    text: 'Yth. Bapak/Ibu,\n\nTerima kasih telah menghubungi BPBJ Kota Semarang. Menanggapi pengaduan yang disampaikan, berikut kami sampaikan penjelasan kami.',
  },
  {
    label: 'Penutup',
    text: 'Demikian informasi yang dapat kami sampaikan. Apabila masih terdapat pertanyaan lanjutan, Bapak/Ibu dapat menghubungi kami kembali melalui kanal resmi BPBJ Kota Semarang.\n\nHormat kami,\nBPBJ Kota Semarang',
  },
];

export default function AdminContacts() {
  const { data: contacts = [], isLoading } = useContacts();
  const updateStatusMutation = useUpdateContactStatus();
  const replyMutation = useReplyContact();
  const deleteMutation = useDeleteContact();
  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [formError, setFormError] = useState('');
  const [replyError, setReplyError] = useState('');
  const [replyInfo, setReplyInfo] = useState('');
  const [replyForm, setReplyForm] = useState({ replySubject: '', replyMessage: '' });
  const [replyTemplateBlocks, setReplyTemplateBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(CONTACT_SUBJECT_ALL);
  const [selectedStatus, setSelectedStatus] = useState(CONTACT_STATUS_ALL);
  const [sortOrder, setSortOrder] = useState('newest');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusChange = async (id, newStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
  };

  const openDetails = async (contact) => {
    const initialContact = contact.status === 'UNREAD' ? { ...contact, status: 'READ' } : contact;
    setDetailItem(initialContact);
    setReplyError('');
    setReplyInfo('');
    setReplyForm({
      replySubject: contact.replySubject || `Re: ${contact.subject || 'Pengaduan BPBJ Kota Semarang'}`,
      replyMessage: contact.replyMessage || '',
    });
    setReplyTemplateBlocks([]);
    if (contact.status === 'UNREAD') {
      const updatedContact = await updateStatusMutation.mutateAsync({ id: contact.id, status: 'READ' });
      setDetailItem(updatedContact);
    }
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    setReplyError('');
    setReplyInfo('');

    try {
      const templateMessage = replyTemplateBlocks.map((template) => template.text).join('\n\n');
      const manualMessage = replyForm.replyMessage.trim();
      const replyMessage = [templateMessage, manualMessage].filter(Boolean).join('\n\n');

      if (!replyMessage) {
        setReplyError('Isi balasan wajib diisi atau pilih template pembuka/penutup terlebih dahulu.');
        return;
      }

      const updatedContact = await replyMutation.mutateAsync({
        id: detailItem.id,
        data: { ...replyForm, replyMessage },
      });
      setDetailItem(updatedContact);
      setReplyTemplateBlocks([]);
      setReplyForm({ replySubject: updatedContact.replySubject || replyForm.replySubject, replyMessage: updatedContact.replyMessage || '' });
      setReplyInfo(updatedContact.emailSent
        ? 'Balasan berhasil dikirim ke email pengadu dan tercatat di detail.'
        : 'Balasan sudah tercatat. Email belum terkirim karena konfigurasi SMTP belum tersedia atau gagal tersambung.');
    } catch (error) {
      setReplyError(error.response?.data?.error || 'Balasan gagal diproses. Periksa isi balasan lalu coba lagi.');
    }
  };

  const addReplyTemplate = (template) => {
    setReplyTemplateBlocks((currentBlocks) => (
      currentBlocks.some((block) => block.label === template.label) ? currentBlocks : [...currentBlocks, template]
    ));
  };

  const removeReplyTemplate = (templateLabel) => {
    setReplyTemplateBlocks((currentBlocks) => currentBlocks.filter((block) => block.label !== templateLabel));
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

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
  const statusFilterOptions = [
    { value: CONTACT_STATUS_ALL, label: 'Semua status' },
    ...statusOptions,
  ];
  const subjectFilterOptions = useMemo(() => [
    { value: CONTACT_SUBJECT_ALL, label: 'Semua tag' },
    ...Array.from(new Set(contacts.map((contact) => contact.subject || 'Tanpa subjek')))
      .filter(Boolean)
      .map((subject) => ({ value: subject, label: subject })),
  ], [contacts]);
  const filteredContacts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const nextContacts = contacts.filter((contact) => {
      const statusMatches = selectedStatus === CONTACT_STATUS_ALL || contact.status === selectedStatus;
      const itemSubject = contact.subject || 'Tanpa subjek';
      const subjectMatches = selectedSubject === CONTACT_SUBJECT_ALL || itemSubject === selectedSubject;
      const searchMatches = !normalizedSearch || [
        contact.name,
        contact.email,
      ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));

      return statusMatches && subjectMatches && searchMatches;
    });

    return nextContacts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });
  }, [contacts, searchTerm, selectedSubject, selectedStatus, sortOrder]);
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedContacts = pageSize === 'all'
    ? filteredContacts
    : filteredContacts.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Memuat data pengaduan...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Kotak Masuk"
        title="Kelola Pengaduan"
      />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-md">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
          <AdminTextInput
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama atau email pengadu"
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center xl:justify-end">
          <AdminSelect
            value={selectedSubject}
            onChange={(subject) => {
              setSelectedSubject(subject);
              setCurrentPage(1);
            }}
            options={subjectFilterOptions}
            size="sm"
            className="xl:w-44"
          />
          <AdminSelect
            value={selectedStatus}
            onChange={(status) => {
              setSelectedStatus(status);
              setCurrentPage(1);
            }}
            options={statusFilterOptions}
            size="sm"
            className="xl:w-40"
          />
          <AdminSelect
            value={sortOrder}
            onChange={(sort) => {
              setSortOrder(sort);
              setCurrentPage(1);
            }}
            options={SORT_OPTIONS}
            size="sm"
            className="xl:w-36"
          />
          <AdminSelect
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            options={PAGE_SIZE_OPTIONS}
            size="sm"
            className="xl:w-36"
          />
        </div>
      </div>

      <AdminTableCard>
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-[22%] px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Pengirim</th>
                <th className="w-[16%] px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Subjek</th>
                <th className="w-[20%] px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Pesan</th>
                <th className="w-[18%] px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</th>
                <th className="w-[16%] px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="w-[8%] px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedContacts.map((contact) => (
                <tr key={contact.id} className="bg-white transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex min-w-0 items-center gap-2">
                      {contact.status === 'UNREAD' && (
                        <span className="relative inline-flex aspect-square h-1.5 flex-shrink-0 items-center justify-center" aria-label="Pesan baru">
                          <span className="absolute -inset-0.5 animate-ping rounded-full bg-primary/60 opacity-70" />
                          <span className="relative aspect-square h-1.5 rounded-full bg-primary" />
                        </span>
                      )}
                      <p className="min-w-0 truncate font-semibold text-slate-800">{contact.name}</p>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400">{contact.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 truncate">{contact.subject || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <p className="truncate">{contact.message}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    <p>{formatDate(contact.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <AdminSelect
                      value={contact.status}
                      onChange={(newStatus) => handleStatusChange(contact.id, newStatus)}
                      options={statusOptions}
                      size="sm"
                      className="w-36"
                      buttonClassName={`${statusColors[contact.status] || 'bg-slate-50 text-slate-600 border-slate-200'} shadow-none`}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openDetails(contact)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Detail Pengaduan">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact)}
                        disabled={!['READ', 'REPLIED'].includes(contact.status)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        title="Hapus Pengaduan"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-3 opacity-30">forum</span>
                    <p>{contacts.length === 0 ? 'Belum ada pengaduan masuk.' : 'Tidak ada pengaduan yang cocok dengan pencarian atau filter tag.'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </AdminTableCard>

      {filteredContacts.length > 0 && pageSize !== 'all' && (
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

      {detailItem && (
        <AdminModal eyebrow="Kotak Masuk" title="Detail Pengaduan" onClose={() => setDetailItem(null)} maxWidth="max-w-3xl">
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Nama</p>
                  <p className="font-semibold text-slate-800">{detailItem.name}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Email</p>
                  <a href={`mailto:${detailItem.email}`} className="font-semibold text-primary break-all">{detailItem.email}</a>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Dikirim</p>
                  <p className="font-semibold text-slate-800">{formatDate(detailItem.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Subjek</p>
                <p className="text-lg font-medium text-slate-800">{detailItem.subject || 'Tanpa subjek'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Isi Pengaduan</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {detailItem.message}
                </div>
              </div>
              {detailItem.replyMessage && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Balasan Tercatat</p>
                  <div className="rounded-lg border border-green-100 bg-green-50 p-5 text-slate-700">
                    <p className="font-semibold text-slate-900">{detailItem.replySubject}</p>
                    <p className="mt-3 whitespace-pre-wrap leading-relaxed">{detailItem.replyMessage}</p>
                    <p className="mt-4 text-xs font-medium text-green-700">
                      {detailItem.emailSentAt ? `Email terkirim pada ${formatDate(detailItem.emailSentAt)}` : 'Balasan tersimpan, email belum tercatat terkirim.'}
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleReplySubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">Balas Pengaduan</p>
                  <p className="mt-1 text-sm text-slate-500">Balasan akan dicatat di detail dan dikirim ke email pengadu jika SMTP sudah dikonfigurasi.</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">Email pengirim mengikuti konfigurasi server: SMTP_FROM, atau SMTP_USER jika SMTP_FROM kosong.</p>
                </div>
                {replyError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{replyError}</div>}
                {replyInfo && <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-blue-700">{replyInfo}</div>}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Subjek Balasan</label>
                  <AdminTextInput
                    value={replyForm.replySubject}
                    onChange={(event) => setReplyForm({ ...replyForm, replySubject: event.target.value })}
                    required
                    placeholder="Tulis subjek balasan"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Isi Balasan</label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {REPLY_TEMPLATES.map((template) => {
                      const isSelected = replyTemplateBlocks.some((block) => block.label === template.label);
                      return (
                        <button
                          key={template.label}
                          type="button"
                          onClick={() => addReplyTemplate(template)}
                          disabled={isSelected}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_notes</span>
                          {template.label}
                        </button>
                      );
                    })}
                  </div>
                  {replyTemplateBlocks.length > 0 && (
                    <div className="mb-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      {replyTemplateBlocks.map((template) => (
                        <div key={template.label} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-primary">{template.label}</span>
                            <button
                              type="button"
                              onClick={() => removeReplyTemplate(template.label)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
                              aria-label={`Hapus template ${template.label}`}
                            >
                              <span className="material-symbols-outlined text-[17px]">close</span>
                            </button>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{template.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <AdminTextarea
                    value={replyForm.replyMessage}
                    onChange={(event) => setReplyForm({ ...replyForm, replyMessage: event.target.value })}
                    rows={6}
                    placeholder="Tulis isi balasan tambahan untuk pengadu"
                  />
                </div>
                <div className="flex justify-end">
                  <AdminButton type="submit" disabled={replyMutation.isPending}>
                    {replyMutation.isPending && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                    Kirim Balasan
                  </AdminButton>
                </div>
              </form>
            </div>
        </AdminModal>
      )}

      {deleteItem && (
        <AdminModal eyebrow="Aksi Berisiko" title="Hapus Pengaduan" onClose={() => setDeleteItem(null)} maxWidth="max-w-lg">
            <form onSubmit={handleDelete} className="p-8 space-y-5">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Pengaduan dari <strong>{deleteItem.name}</strong> akan dihapus permanen. Pengaduan hanya bisa dihapus setelah berstatus sudah dibaca atau sudah dibalas.
              </div>
              {formError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ketik DELETE untuk konfirmasi</label>
                <AdminTextInput
                  type="text"
                  required
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder="Ketik DELETE"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <AdminButton type="button" variant="neutral" onClick={() => setDeleteItem(null)}>Batal</AdminButton>
                <AdminButton type="submit" disabled={deleteMutation.isPending} variant="danger">
                  Hapus Pengaduan
                </AdminButton>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}
