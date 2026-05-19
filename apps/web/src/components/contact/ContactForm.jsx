export default function ContactForm() {
  return (
    <div className="lg:col-span-8 bg-surface-container-low p-8 md:p-12 shadow-sm">
      <div className="mb-10">
        <div className="w-12 h-1 bg-primary mb-6"></div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-4">Kirim Aspirasi &amp; Pertanyaan</h2>
        <p className="text-on-surface-variant leading-relaxed">
          Kami menghargai setiap masukan Anda. Gunakan formulir di bawah ini untuk mengirimkan pertanyaan atau aspirasi terkait pengadaan barang dan jasa di lingkungan Pemerintah Kota Semarang.
        </p>
      </div>
      <form action="#" className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Nama Lengkap</label>
          <input className="w-full bg-surface-container-high border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-all outline-none" placeholder="Masukkan nama Anda" type="text"/>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Alamat Email</label>
          <input className="w-full bg-surface-container-high border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-all outline-none" placeholder="contoh@mail.com" type="email"/>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Subjek / Kategori</label>
          <select className="w-full bg-surface-container-high border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-all outline-none">
            <option>Pertanyaan Umum</option>
            <option>Aspirasi Pembangunan</option>
            <option>Laporan Pengaduan</option>
            <option>Informasi Lelang / Tender</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Pesan Anda</label>
          <textarea className="w-full bg-surface-container-high border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-all resize-none outline-none" placeholder="Tuliskan pesan Anda di sini..." rows={6}></textarea>
        </div>
        <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between pt-4 gap-6">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter max-w-xs font-medium">
            Dengan menekan tombol kirim, Anda menyetujui kebijakan privasi kami mengenai pengolahan data pribadi.
          </p>
          <button className="bg-primary hover:bg-primary-container text-white px-10 py-4 font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 w-full md:w-auto" type="submit">
            Kirim Sekarang
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
