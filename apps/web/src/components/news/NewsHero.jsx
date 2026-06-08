export default function NewsHero() {
  return (
    <header className="mb-8 pt-28 md:mb-12 md:pt-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-4 inline-block bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-on-primary">Ruang Informasi Resmi</span>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-on-surface md:text-7xl md:font-black md:leading-none md:tracking-tighter">
            BERITA <span className="text-primary">BPBJ</span>
          </h1>
          <p className="max-w-xl text-base leading-7 text-on-surface-variant md:text-lg md:leading-relaxed">
            Kabar resmi seputar pengadaan barang dan jasa Kota Semarang, mulai dari informasi layanan, kegiatan, sosialisasi, hingga agenda strategis BPBJ.
          </p>
        </div>
      </div>
    </header>
  );
}
