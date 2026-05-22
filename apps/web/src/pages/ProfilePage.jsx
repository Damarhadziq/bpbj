import ProfileHero from '../components/profile/ProfileHero';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import AboutSection from '../components/profile/AboutSection';
import VisionMissionSection from '../components/profile/VisionMissionSection';
import TasksFunctionsSection from '../components/profile/TasksFunctionsSection';
import OrganizationStructureSection from '../components/profile/OrganizationStructureSection';

export default function ProfilePage() {
  return (
    <main className="flex-grow pb-16 w-full">
      <ProfileHero />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-2 hidden lg:block">
          <ProfileSidebar />
        </aside>
        <div className="lg:col-span-9 space-y-24">
          <AboutSection />
          <VisionMissionSection />
          <TasksFunctionsSection />
          <OrganizationStructureSection />
        </div>
      </div>
    </main>
  );
}
