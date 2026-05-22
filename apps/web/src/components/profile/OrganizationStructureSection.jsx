import organizationStructure from '../../assets/organization-structure.jpg';

export default function OrganizationStructureSection() {
  return (
    <section className="scroll-mt-32" id="struktur">
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-8 uppercase">Struktur Organisasi</h2>
      <div
        className="overflow-auto rounded-lg border border-outline-variant/30 bg-white shadow-sm"
        aria-label="Bagan struktur organisasi"
        tabIndex={0}
      >
        <div className="min-w-[1120px] p-4 md:min-w-[1320px]">
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
