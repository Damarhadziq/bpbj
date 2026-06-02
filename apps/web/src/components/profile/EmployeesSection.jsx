import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';

const DESKTOP_PAGE_SIZE = 15;
const MOBILE_PAGE_SIZE = 10;
const EMPLOYEE_QUOTES = [
  'Berkomitmen menjaga layanan pengadaan yang tertib, terbuka, akuntabel, dan mudah diakses oleh seluruh pemangku kepentingan.',
  'Mendukung proses kerja yang responsif, teliti, dan konsisten untuk menghadirkan pelayanan publik yang lebih baik.',
  'Menguatkan kolaborasi lintas peran agar setiap layanan pengadaan berjalan rapi, transparan, dan terpercaya.',
  'Hadir dengan semangat profesional untuk mendukung tata kelola pengadaan yang efisien, bersih, dan berintegritas.',
  'Mendorong pelayanan yang cermat, komunikatif, dan berorientasi pada hasil demi proses pengadaan yang semakin berkualitas.',
];

function getEmployeeQuote(employee) {
  if (employee.quote?.trim()) return employee.quote.trim();
  const seedText = `${employee.name || ''}${employee.position || ''}`;
  const seed = Array.from(seedText).reduce((total, char) => total + char.charCodeAt(0), 0);
  return EMPLOYEE_QUOTES[seed % EMPLOYEE_QUOTES.length];
}

function getHoverNameClass(name = '') {
  if (name.length > 28) return 'text-[12px] sm:text-[15px]';
  if (name.length > 20) return 'text-[13px] sm:text-base';
  return 'text-sm sm:text-lg';
}

const MAX_DISPLAY_NAME_LENGTH = 22;

function getCompactName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.join(' ').length <= MAX_DISPLAY_NAME_LENGTH || parts.length < 2) {
    return parts.join(' ');
  }

  const compactParts = [...parts];
  for (let index = compactParts.length - 1; index > 0; index -= 1) {
    compactParts[index] = `${compactParts[index][0]}.`;
    const compactName = compactParts.join(' ');
    if (compactName.length <= MAX_DISPLAY_NAME_LENGTH) return compactName;
  }

  return compactParts.join(' ');
}

export default function EmployeesSection() {
  const { data: employees = [], isLoading } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const activeEmployees = useMemo(() => employees.filter((employee) => employee.isActive), [employees]);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredEmployees = useMemo(() => {
    if (!normalizedSearch) return activeEmployees;
    return activeEmployees.filter((employee) => {
      const searchableText = `${employee.name} ${employee.position}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [activeEmployees, normalizedSearch]);
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedEmployees = filteredEmployees.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const updateViewport = (event) => {
      setIsMobile(event.matches);
      setCurrentPage(1);
    };
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  if (isLoading) {
    return (
      <section className="scroll-mt-32" id="pegawai">
        <h2 className="mb-8 text-3xl font-bold uppercase tracking-tight text-on-surface">Pegawai BPBJ</h2>
        <div className="rounded-xl border border-outline-variant/20 bg-white/95 p-5 shadow-sm">
          <div className="mb-8 h-12 animate-pulse rounded-xl bg-surface-container-high" />
          <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, item) => (
              <div key={item} className="animate-pulse overflow-hidden rounded-xl bg-white">
                <div className="aspect-[3/4] bg-surface-container-high" />
                <div className="px-1 py-3 text-left sm:px-1 sm:py-4">
                  <div className="h-4 w-2/3 rounded bg-surface-container-high sm:h-5" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-surface-container-high sm:h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activeEmployees.length === 0) return null;

  return (
    <section className="scroll-mt-32" id="pegawai">
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-on-surface">Pegawai BPBJ</h2>
        <p className="max-w-2xl text-on-surface-variant">
          Daftar pegawai Badan Pelayanan Pengadaan Barang/Jasa Kota Semarang.
        </p>
      </div>

      <div className="rounded-xl border border-outline-variant/20 bg-white/95 p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-outline-variant/20 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Direktori Pegawai</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Menampilkan {filteredEmployees.length} dari {activeEmployees.length} pegawai aktif
            </p>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama atau jabatan"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface px-12 py-3 text-sm font-medium text-on-surface outline-none transition-all placeholder:text-on-surface-variant/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </label>
        </div>

        {paginatedEmployees.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:hidden">
              {paginatedEmployees.map((employee) => (
                <article key={employee.id} className="overflow-hidden rounded-lg bg-white">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <img
                      src={employee.imageUrl}
                      alt={employee.imageAlt || employee.name}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 w-full p-2.5 text-left">
                      <h3 className="w-full text-sm font-semibold leading-snug text-white">{getCompactName(employee.name)}</h3>
                      <p className="mt-1 w-full text-xs font-normal leading-5 text-[#ececec]">{employee.position}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden grid-cols-2 gap-3 sm:grid sm:gap-6 xl:grid-cols-3">
              {paginatedEmployees.map((employee) => (
              <article
                key={employee.id}
                className="group relative overflow-hidden rounded-xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.10)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-container-high">
                  <img
                    src={employee.imageUrl}
                    alt={employee.imageAlt || employee.name}
                    className="h-full w-full object-cover object-top grayscale-[8%] transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:opacity-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent transition-opacity duration-200 group-hover:opacity-0" />
                  <div className="absolute inset-x-0 bottom-0 w-full p-2.5 text-left transition-opacity duration-200 group-hover:opacity-0 sm:p-3">
                    <h3 className="w-full text-sm font-semibold leading-snug text-white sm:text-base">{getCompactName(employee.name)}</h3>
                    <p className="mt-1 w-full text-xs font-normal leading-5 text-[#ececec] sm:text-sm sm:leading-6">{employee.position}</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 z-10 grid grid-rows-[1fr_auto] overflow-hidden bg-slate-50 px-5 py-5 text-left opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                  <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.95),rgba(248,250,252,0.9)_55%,rgba(241,245,249,0.95)),repeating-radial-gradient(ellipse_at_0%_45%,rgba(148,163,184,0.18)_0px,rgba(148,163,184,0.18)_1px,transparent_3px,transparent_16px)]" />
                  <div className="absolute -right-10 top-8 h-28 w-28 rounded-full border border-slate-200/70" />
                  <div className="absolute left-5 top-16 h-14 w-14 rounded-full border border-slate-200/70 bg-transparent" />
                  <div className="relative hidden items-center sm:flex">
                    <p className="max-w-[18rem] translate-y-2 text-lg font-medium leading-snug text-slate-950 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 lg:text-xl">
                      {getEmployeeQuote(employee)}
                    </p>
                  </div>
                  <div className="relative translate-y-1.5 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="min-w-0 w-full">
                      <h3 className={`w-full whitespace-nowrap font-semibold leading-snug text-slate-950 ${getHoverNameClass(getCompactName(employee.name))}`}>{getCompactName(employee.name)}</h3>
                      <p className="mt-0.5 w-full text-xs font-normal leading-5 text-slate-500 sm:text-sm sm:leading-5">{employee.position}</p>
                    </div>
                  </div>
                </div>
              </article>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface py-14 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">person_search</span>
            <p className="mt-3 font-semibold text-on-surface">Pegawai tidak ditemukan</p>
            <p className="mt-1 text-sm text-on-surface-variant">Coba gunakan nama atau jabatan lain.</p>
          </div>
        )}

        {filteredEmployees.length > pageSize && (
          <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              Halaman {safeCurrentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman sebelumnya"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition-colors ${
                    safeCurrentPage === page
                      ? 'bg-primary text-on-primary'
                      : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safeCurrentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman berikutnya"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
