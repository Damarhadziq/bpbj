import organizationStructure from '../../assets/organization-structure.jpg';

export default function OrganizationStructureSection() {
  return (
    <section className="scroll-mt-32" id="struktur">
      <h2 className="text-2xl font-bold text-on-surface tracking-tight mb-4 uppercase md:text-3xl md:font-extrabold md:mb-8">Struktur Organisasi</h2>
      <p className="mb-3 text-sm leading-6 text-on-surface-variant md:hidden">
        Geser bagan ke samping untuk melihat struktur lengkap.
      </p>
      <div
        className="overflow-auto rounded-lg border border-outline-variant/30 bg-white shadow-sm"
        aria-label="Bagan struktur organisasi"
        tabIndex={0}
      >
        <div className="min-w-[920px] p-3 md:min-w-[1320px] md:p-4">
          <img
            className="h-auto w-full select-none"
            src={organizationStructure}
            alt="Bagan struktur organisasi Pemerintah Kota Semarang"
          />
        </div>
      </div>
    </section>
  );
}
