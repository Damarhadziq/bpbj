import { useSession } from '../../lib/authClient';
import { useContacts } from '../../hooks/useContacts';
import { useGallery } from '../../hooks/useGallery';
import { useNews } from '../../hooks/useNews';
import { useUsers } from '../../hooks/useUsers';
import { useCarousel } from '../../hooks/useCarousel';
import { useEmployees } from '../../hooks/useEmployees';
import PublicationTrendChart from '../../components/admin/charts/PublicationTrendChart';
import CategoryNewsChart from '../../components/admin/charts/CategoryNewsChart';
import VisitorAnalyticsChart from '../../components/admin/charts/VisitorAnalyticsChart';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const isSuperadmin = session?.user?.role === 'superadmin';
  const { data: news = [] } = useNews();
  const { data: gallery = [] } = useGallery();
  const { data: contacts = [] } = useContacts();
  const { data: users = [] } = useUsers({ enabled: isSuperadmin });
  const { data: carousel = [] } = useCarousel();
  const { data: employees = [] } = useEmployees();
  const unreadContacts = contacts.filter((contact) => contact.status === 'UNREAD').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Ringkasan Pengelolaan Website
          </h1>
          <p className="mt-2 text-sm font-normal text-slate-500">
            Halo, <span className="font-medium text-slate-700">{session?.user?.name}</span>. Anda login sebagai <span className="font-medium capitalize text-primary">{session?.user?.role}</span>.
          </p>
        </div>
        <div className="w-fit text-right lg:text-left">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Mode Kerja</p>
            <p className="text-sm font-semibold capitalize text-primary">{session?.user?.role || 'admin'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          { label: 'Total Berita', value: news.length, icon: 'article' },
          { label: 'Galeri Foto', value: gallery.length, icon: 'photo_library' },
          { label: 'Pesan Baru', value: unreadContacts, icon: 'mail' },
          { label: 'Admin Aktif', value: isSuperadmin ? users.length : '-', icon: 'shadow' },
          { label: 'Carousel Aktif', value: carousel.filter((item) => item.isActive).length, icon: 'view_carousel' },
          { label: 'Pegawai Tampil', value: employees.filter((item) => item.isActive).length, icon: 'badge' },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-lg border border-[#ececec] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                <span className="material-symbols-outlined text-[21px]">{stat.icon === 'shadow' ? 'shield_person' : stat.icon}</span>
              </div>
              <div>
                <p className="text-right text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                <p className="mt-1 text-right text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Interactive Analytics Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col min-h-[360px]">
          <PublicationTrendChart news={news} gallery={gallery} />
        </div>
        <div className="flex flex-col min-h-[360px]">
          <CategoryNewsChart news={news} />
        </div>
        <div className="flex flex-col min-h-[360px]">
          <VisitorAnalyticsChart />
        </div>
      </div>
    </div>
  );
}
