import { useState } from 'react';
import { useCreateContact } from '../../hooks/useContacts';
import CustomSelect from '../ui/CustomSelect';

const SUBJECT_OPTIONS = [
  'Pertanyaan Umum',
  'Aspirasi Pembangunan',
  'Laporan Pengaduan',
  'Informasi Lelang / Tender',
];

export default function ContactForm() {
  const createContact = useCreateContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Pertanyaan Umum',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    await createContact.mutateAsync(formData);
    setFormData({
      name: '',
      email: '',
      subject: 'Pertanyaan Umum',
      message: '',
    });
    setStatus('sent');
  };

  const fieldClassName = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-normal text-slate-800 outline-none transition-all placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10';
  const labelClassName = 'text-sm font-medium text-slate-700';

  return (
    <div className="scroll-mt-32 lg:col-span-8 bg-white p-5 md:p-12" id="pengaduan">
      <div className="mb-7 md:mb-10">
        <div className="hidden w-12 h-1 bg-primary mb-6 md:block"></div>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-3 md:text-3xl md:font-extrabold md:mb-4">Kirim Aspirasi &amp; Pertanyaan</h2>
        <p className="text-on-surface-variant leading-relaxed">
          Kami menghargai setiap masukan Anda. Gunakan formulir di bawah ini untuk mengirimkan pertanyaan atau aspirasi terkait pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang.
        </p>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className={labelClassName}>Nama Lengkap</label>
          <input
            className={fieldClassName}
            placeholder="Masukkan nama Anda"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Alamat Email</label>
          <input
            className={fieldClassName}
            placeholder="contoh@mail.com"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className={labelClassName}>Subjek / Kategori</label>
          <CustomSelect
            value={formData.subject}
            onChange={(subject) => setFormData((current) => ({ ...current, subject }))}
            options={SUBJECT_OPTIONS}
            buttonClassName="h-11 rounded-lg border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal shadow-none focus-visible:ring-4"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className={labelClassName}>Pesan Anda</label>
          <textarea
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            placeholder="Tuliskan pesan Anda di sini..."
            rows={6}
            value={formData.message}
            onChange={handleChange('message')}
            required
          />
        </div>
        {(status || createContact.isError) && (
          <div className="md:col-span-2">
            <p className={`text-sm font-semibold ${createContact.isError ? 'text-red-600' : 'text-green-600'}`}>
              {createContact.isError ? 'Pesan gagal dikirim. Silakan coba lagi.' : 'Pesan berhasil dikirim.'}
            </p>
          </div>
        )}
        <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between pt-2 md:pt-4 gap-5 md:gap-6">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter max-w-xs font-medium">
            Dengan menekan tombol kirim, Anda menyetujui kebijakan privasi kami mengenai pengolahan data pribadi.
          </p>
          <button
            className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 font-bold uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 w-full md:w-auto md:px-10 md:py-4 md:font-black disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={createContact.isPending}
          >
            {createContact.isPending ? 'Mengirim...' : 'Kirim Sekarang'}
            <span className="material-symbols-outlined text-sm">{createContact.isPending ? 'progress_activity' : 'send'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
