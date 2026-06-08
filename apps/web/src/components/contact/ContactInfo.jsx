export default function ContactInfo() {
  return (
    <div className="bg-surface-container-lowest p-5 shadow-sm rounded-none border-l-4 border-primary md:p-8">
      <h3 className="text-primary text-xs font-black uppercase tracking-widest mb-5 md:mb-6">Informasi Kontak</h3>
      <div className="space-y-5 md:space-y-8">
        <div className="flex items-start gap-3 md:gap-4">
          <span className="material-symbols-outlined text-primary mt-1">location_on</span>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Alamat Kantor</p>
            <p className="text-on-surface leading-relaxed">Jl. Pemuda No. 148, Gedung Moch Ichsan Lantai 6, Sekayu, Semarang Tengah, Kota Semarang</p>
          </div>
        </div>
        <div className="flex items-start gap-3 md:gap-4">
          <span className="material-symbols-outlined text-primary mt-1">mail</span>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Email Resmi</p>
            <p className="text-on-surface">bpbj@semarangkota.go.id</p>
          </div>
        </div>
        <div className="flex items-start gap-3 md:gap-4">
          <span className="material-symbols-outlined text-primary mt-1">call</span>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Telepon &amp; Fax</p>
            <p className="text-on-surface">(024) 3584000</p>
          </div>
        </div>
        <div className="flex items-start gap-3 md:gap-4">
          <span className="material-symbols-outlined text-primary mt-1">schedule</span>
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Jam Operasional</p>
            <p className="text-on-surface">Senin - Kamis: 08.00 - 16.00<br/>Jumat: 08.00 - 14.30</p>
          </div>
        </div>
      </div>
    </div>
  );
}
