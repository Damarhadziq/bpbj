export default function ProfileHero() {
  return (
    <header className="relative w-full h-[380px] pt-28 flex items-end overflow-hidden mb-10 md:h-[512px] md:pt-32 md:mb-16">
      <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn78QGl11E-TJ1I6NMoSK9Ft7_60fpFhtYRqDEp1kEZVlqGVwIi3KX85ewmEA_KaP6zlcOd2HR3WO-ILm1tRoeEHc7mmYKphOUANIVDKP_ycFJ6_Sijx18LtRK9alkg61Snbr-VcwaOnG6svRVkHRrbcv0rOu3Ee9uXCfwOnBIOZCnBm9Ri8HcEtLhYb3PTqGZhcqc8IY6QObbOJlFW70d-3JOB-OH5NmzPmns3xZtLGW24xrt2grgVpRHPbZSb8Dx4vuwWVUzdw" alt="Gedung administrasi modern" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pb-9 md:pb-12 w-full">
        <p className="text-white/80 font-medium tracking-[0.18em] uppercase text-xs mb-3 md:text-sm md:mb-4">Profil Instansi</p>
        <h1 className="text-white text-4xl md:text-7xl font-semibold md:font-black tracking-tight md:tracking-tighter leading-[1.05] max-w-4xl">
          TRANSPARANSI DALAM <br/>SETIAP PROSES.
        </h1>
      </div>
    </header>
  );
}
