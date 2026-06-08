import { useMemo } from 'react';
import { useRegulations } from '../../hooks/useRegulations';

export default function RegulationsSection() {
  const { data: regulations = [], isLoading } = useRegulations();
  const activeRegulations = useMemo(() => (
    regulations.filter((item) => item.isActive)
  ), [regulations]);

  return (
    <section className="scroll-mt-32" id="regulasi">
      <div className="hidden bg-primary w-12 h-1 mb-6 md:inline-block"></div>
      <div className="mb-8 max-w-3xl">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight uppercase md:text-3xl md:font-extrabold">Regulasi</h2>
        <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
          Rujukan peraturan pengadaan barang/jasa pemerintah dan ketentuan turunannya yang menjadi dasar pelaksanaan layanan BPBJ Kota Semarang.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Memuat regulasi...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {activeRegulations.map((item) => {
            const content = (
              <>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{item.category}</span>
                  {item.linkUrl && <span className="material-symbols-outlined text-[20px] text-slate-400">open_in_new</span>}
                </div>
                <h3 className="text-lg font-semibold leading-snug text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm font-normal leading-6 text-slate-600">{item.description}</p>
              </>
            );

            if (item.linkUrl) {
              return (
                <a
                  key={item.id}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-slate-900/5 md:p-5"
                >
                  {content}
                </a>
              );
            }

            return (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
                {content}
              </article>
            );
          })}

          {activeRegulations.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 md:col-span-2">
              Data regulasi belum tersedia.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
