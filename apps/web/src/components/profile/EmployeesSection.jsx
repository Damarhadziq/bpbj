import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';

const DESKTOP_PAGE_SIZE = 12;
const MOBILE_PAGE_SIZE = 8;

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
  const firstItem = filteredEmployees.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const lastItem = Math.min(safeCurrentPage * pageSize, filteredEmployees.length);
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
        <div className="rounded-xl border border-outline-variant/20 bg-white/95 p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-outline-variant/20 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-surface-container-high" />
              <div className="h-4 w-52 animate-pulse rounded bg-surface-container-high" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-surface-container-high lg:max-w-sm" />
          </div>
          <div className="overflow-hidden rounded-xl border border-outline-variant/20">
            {Array.from({ length: 6 }, (_, item) => (
              <div key={item} className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-b border-outline-variant/20 px-4 py-4 last:border-b-0 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1.2fr)]">
                <div className="h-4 animate-pulse rounded bg-surface-container-high" />
                <div className="h-4 animate-pulse rounded bg-surface-container-high" />
                <div className="hidden h-4 animate-pulse rounded bg-surface-container-high sm:block" />
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
          <div className="overflow-hidden rounded-xl border border-outline-variant/20">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-outline-variant/20 text-left">
                <colgroup>
                  <col className="w-16 sm:w-20" />
                  <col className="w-[42%]" />
                  <col className="w-[58%]" />
                </colgroup>
                <thead className="bg-surface-container-low">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant sm:px-5">
                      No
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant sm:px-5">
                      Nama
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant sm:px-5">
                      Jabatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 bg-white">
                  {paginatedEmployees.map((employee, index) => (
                    <tr key={employee.id} className="transition-colors hover:bg-surface-container-low/70">
                      <td className="px-4 py-4 text-sm font-semibold text-on-surface-variant sm:px-5">
                        {(safeCurrentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold leading-6 text-on-surface sm:px-5">
                        {employee.name}
                      </td>
                      <td className="px-4 py-4 text-sm leading-6 text-on-surface-variant sm:px-5">
                        {employee.position}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface py-14 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">person_search</span>
            <p className="mt-3 font-semibold text-on-surface">Pegawai tidak ditemukan</p>
            <p className="mt-1 text-sm text-on-surface-variant">Coba gunakan nama atau jabatan lain.</p>
          </div>
        )}

        {filteredEmployees.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              Menampilkan {firstItem}-{lastItem} dari {filteredEmployees.length} data
            </p>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-2">
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}
