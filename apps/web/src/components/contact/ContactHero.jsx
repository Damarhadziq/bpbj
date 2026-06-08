export default function ContactHero() {
  return (
    <section className="relative bg-primary-container pt-28 pb-20 overflow-hidden md:pt-32 md:pb-24">
      <div className="absolute inset-0 opacity-10">
        <img className="w-full h-full object-cover" alt="Detail arsitektur gedung pemerintahan modern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQD5Z59Tt_vLQMl81KRTUyWQ2MudYGHwuAKhW8YFDJfdOvBIz1e6PGGAsdI_E5hcKNPwXTfmPeoeBG8bzwtCUT0v1Oc_dPCKQlZHDBNreojIbuQM7cRT40KnvUh9-c_WDVtAbASMTkX8aGIHnIkVHsgm1IG_WAB2Ih_Ob1wCpwynQPRDGQBZVG62m4tlErKBrmjoKNLy7r_3Db46QHTPUq9INplWXwWv2H2tkxfaKQU3mE72iSm5McuUEZjpU4sm7O3jVryR5fNQ"/>
      </div>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
        <div className="max-w-3xl">
          <span className="text-white/80 uppercase tracking-widest text-xs font-bold mb-3 block md:text-sm md:mb-4">Pelayanan Publik</span>
          <h1 className="text-4xl md:text-7xl font-semibold md:font-extrabold text-white tracking-tight md:tracking-tighter mb-5 md:mb-6 leading-tight">
            Aksesibilitas &amp; <br/>Transparansi Utama
          </h1>
          <p className="text-white/90 text-base leading-7 max-w-2xl font-light md:text-xl md:leading-relaxed">
            Hubungi kami untuk informasi pengadaan barang dan jasa, pengaduan, atau aspirasi demi pembangunan Kota Semarang yang lebih baik.
          </p>
        </div>
      </div>
    </section>
  );
}
