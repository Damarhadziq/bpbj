const cityMissions = [
  'Mewujudkan pemerataan pendidikan dan kesejahteraan sosial masyarakat yang toleran dan berbudaya dalam semangat kebhinekaan, serta meningkatkan pembangunan manusia yang produktif, berkualitas, dan berkepribadian.',
  'Mewujudkan kesehatan seluruh masyarakat yang berfokus pada kebutuhan individu dengan mengutamakan aspek pencegahan, pengobatan, dan rehabilitasi.',
  'Mewujudkan pemenuhan kebutuhan dasar berupa ketersediaan pangan, sandang, dan papan yang merupakan elemen kunci agar tercapai taraf hidup yang layak.',
  'Mewujudkan perekonomian inklusif melalui penyediaan lapangan kerja dengan membangun kemandirian ekonomi kerakyatan berbasis potensi sumber daya lokal dan peningkatan daya saing sumber daya manusia dengan pemanfaatan teknologi digital.',
  'Mewujudkan infrastruktur kota yang saling terhubung dengan peningkatan aksesibilitas dan konektivitas antar wilayah yang berkelanjutan.',
  'Mewujudkan kualitas lingkungan kota yang tangguh, berkelanjutan, sekaligus peningkatan pengendalian banjir, rob, serta dampaknya bagi masyarakat.',
  'Mewujudkan pelayanan publik dan tata kelola pemerintahan yang berkualitas, dinamis, bersih, bebas dari korupsi, berkeadaban, dan inklusif berbasis kota cerdas.'
];

export default function VisionMissionSection() {
  return (
    <section className="scroll-mt-32" id="visi-misi">
      <div className="rounded-2xl bg-primary-container p-6 text-white md:p-10">
        <div className="space-y-8">
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-white/65">Visi Kota Semarang</h3>
            <p className="max-w-4xl text-2xl font-semibold italic leading-snug tracking-tight md:text-4xl md:font-bold md:leading-tight">
              "Kota Semarang Menjadi Pusat Ekonomi yang Maju, Berkeadilan Sosial, Lestari, dan Inklusif."
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/65">Misi Kota Semarang</h3>
            <ol className="grid gap-3 md:grid-cols-2">
              {cityMissions.map((mission, index) => (
                <li key={mission} className="rounded-xl border border-white/15 bg-white/10 p-5 transition-colors hover:bg-white/15">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/90">{mission}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
