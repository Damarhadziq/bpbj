import ContactHero from '../components/contact/ContactHero';
import ContactInfo from '../components/contact/ContactInfo';
import MapCard from '../components/contact/MapCard';
import ContactForm from '../components/contact/ContactForm';
import SocialTrustBar from '../components/contact/SocialTrustBar';
import SEOHead from '../components/SEOHead';
import { faqSchema, generateBreadcrumbSchema, organizationSchema, pageSEO } from '../utils/seoConfig';

export default function ContactPage() {
  return (
    <main className="flex-grow pb-16 w-full">
      <SEOHead
        {...pageSEO.contact}
        schemas={[
          organizationSchema,
          faqSchema,
          generateBreadcrumbSchema([
            { name: 'Beranda', url: '/' },
            { name: 'Kontak', url: '/contact' },
          ]),
        ]}
      />
      <ContactHero />
      <section className="max-w-7xl mx-auto px-5 sm:px-6 -mt-10 md:-mt-16 relative z-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
          <div className="lg:col-span-4 space-y-6">
            <ContactInfo />
            <MapCard />
          </div>
          <ContactForm />
        </div>
      </section>
      <SocialTrustBar />
    </main>
  );
}
