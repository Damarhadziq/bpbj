import { useSession } from '../../lib/authClient';
import { useContacts } from '../../hooks/useContacts';
import { useGallery } from '../../hooks/useGallery';
import { useNews } from '../../hooks/useNews';
import { useUsers } from '../../hooks/useUsers';
import { useCarousel } from '../../hooks/useCarousel';
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
  const unreadContacts = contacts.filter((contact) => contact.status === 'UNREAD').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Selamat datang, {session?.user?.name}!
        </h1>
        <p className="text-slate-500">
          Anda login sebagai <span className="font-semibold text-primary capitalize">{session?.user?.role}</span>.
          Pilih menu di samping untuk mulai mengelola konten website BPBJ Kota Semarang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {/* Placeholder Stat Cards */}
        {[
          { label: 'Total Berita', value: news.length, icon: 'article', color: 'bg-blue-50 text-blue-600' },
          { label: 'Galeri Foto', value: gallery.length, icon: 'photo_library', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pesan Baru', value: unreadContacts, icon: 'mail', color: 'bg-amber-50 text-amber-600' },
          { label: 'Admin Aktif', value: isSuperadmin ? users.length : '-', icon: 'shadow', color: 'bg-purple-50 text-purple-600' },
          { label: 'Carousel Aktif', value: carousel.filter((item) => item.isActive).length, icon: 'view_carousel', color: 'bg-rose-50 text-rose-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon === 'shadow' ? 'shield_person' : stat.icon}</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Interactive Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
