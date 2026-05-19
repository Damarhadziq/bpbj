export default function OrganizationStructureSection() {
  return (
    <section className="scroll-mt-32" id="struktur">
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-8 uppercase">Struktur Organisasi</h2>
      <div className="p-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <img className="w-full h-auto rounded-lg" data-alt="Organizational chart diagram" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIAA0dSEZb1mv0ueXepV0ZVO2EaGXDNEKwK70CF5Dg22OHCs5EcWteUB2D-q19uRWkDhUj4rmh_x85VaWxDGBniWfADcMoNvANfjlQHKkmqbvESNY2rwvlkI4GDu_LeriYoGM42IT027RTsakTeF5L3-GRyf47BhHIjakkZoif04we5ovRYuGEwxdXJqApBE2oArhTTLypoUOZVzAjF-VnSx-A6hYIoHFry7R_Ajmv6gHD-NbuzU276DdIYnASuIYWdoMM56bukg"/>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-surface-container-low text-center">
          <p className="text-primary text-2xl font-black mb-1">1</p>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kepala Bagian</p>
        </div>
        <div className="p-6 bg-surface-container-low text-center">
          <p className="text-primary text-2xl font-black mb-1">3</p>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sub Koordinator</p>
        </div>
        <div className="p-6 bg-surface-container-low text-center">
          <p className="text-primary text-2xl font-black mb-1">12</p>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Fungsional Ahli</p>
        </div>
        <div className="p-6 bg-surface-container-low text-center">
          <p className="text-primary text-2xl font-black mb-1">8</p>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Staf Pendukung</p>
        </div>
      </div>
    </section>
  );
}
