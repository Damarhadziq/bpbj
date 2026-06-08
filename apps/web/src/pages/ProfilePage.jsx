import ProfileHero from '../components/profile/ProfileHero';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import AboutSection from '../components/profile/AboutSection';
import VisionMissionSection from '../components/profile/VisionMissionSection';
import TasksFunctionsSection from '../components/profile/TasksFunctionsSection';
import RegulationsSection from '../components/profile/RegulationsSection';
import OrganizationStructureSection from '../components/profile/OrganizationStructureSection';
import EmployeesSection from '../components/profile/EmployeesSection';
import SEOHead from '../components/SEOHead';
import { generateBreadcrumbSchema, organizationSchema, pageSEO } from '../utils/seoConfig';

export default function ProfilePage() {
  return (
    <main className="flex-grow pb-16 w-full">
      <SEOHead
        {...pageSEO.profile}
        schemas={[
          organizationSchema,
          generateBreadcrumbSchema([
            { name: 'Beranda', url: '/' },
            { name: 'Profil', url: '/profile' },
          ]),
        ]}
      />
      <ProfileHero />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <aside className="lg:col-span-3 space-y-2 hidden lg:block">
          <ProfileSidebar />
        </aside>
        <div className="lg:col-span-9 space-y-16 md:space-y-24">
          <AboutSection />
          <VisionMissionSection />
          <TasksFunctionsSection />
          <RegulationsSection />
          <OrganizationStructureSection />
          <EmployeesSection />
        </div>
      </div>
    </main>
  );
}
