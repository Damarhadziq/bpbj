import { useEffect } from 'react';
import { seoConfig } from '../utils/seoConfig';

/**
 * SEOHead — Dynamic SEO metadata component
 * Sets document title, meta tags, Open Graph, Twitter Card, canonical, and JSON-LD
 * Uses direct DOM manipulation (no external dependencies)
 */
export default function SEOHead({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  schemas = [],
  noindex = false,
}) {
  const fullTitle = title || `${seoConfig.siteName} — Portal Pengadaan Barang dan Jasa`;
  const fullDescription = description || seoConfig.defaultDescription;
  const canonicalUrl = `${seoConfig.baseUrl}${path}`;
  const ogImage = image || seoConfig.defaultImage;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set/create meta tags
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', fullDescription);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', fullDescription);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', seoConfig.siteName);
    setMeta('property', 'og:locale', seoConfig.locale);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', seoConfig.twitterHandle);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', fullDescription);
    setMeta('name', 'twitter:image', ogImage);

    // JSON-LD Structured Data
    // Remove previous JSON-LD scripts injected by this component
    document.querySelectorAll('script[data-seo-head="true"]').forEach(el => el.remove());

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-head', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('script[data-seo-head="true"]').forEach(el => el.remove());
    };
  }, [fullTitle, fullDescription, canonicalUrl, ogImage, type, noindex, schemas]);

  // This component renders nothing visually
  return null;
}
