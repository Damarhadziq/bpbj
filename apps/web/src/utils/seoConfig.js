// SEO Configuration for BPBJ Kota Semarang
// Centralized metadata and structured data definitions

const SITE_NAME = 'BPBJ Kota Semarang';
const BASE_URL = 'https://bpbj.semarangkota.go.id';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_DESCRIPTION = 'Portal resmi Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang. Informasi tender, e-katalog, dan layanan pengadaan transparan.';

export const seoConfig = {
  siteName: SITE_NAME,
  baseUrl: BASE_URL,
  defaultImage: DEFAULT_OG_IMAGE,
  defaultDescription: SITE_DESCRIPTION,
  locale: 'id_ID',
  twitterHandle: '@BpbjSemarang',
};

// Per-page SEO metadata
export const pageSEO = {
  home: {
    title: 'BPBJ Kota Semarang — Portal Pengadaan Barang dan Jasa',
    description: 'Portal resmi Bagian Pengadaan Barang dan Jasa Kota Semarang. Akses informasi tender, e-katalog, layanan pengaduan, dan transparansi pengadaan pemerintah.',
    path: '/',
  },
  profile: {
    title: 'Profil Instansi — BPBJ Kota Semarang',
    description: 'Kenali visi, misi, tugas pokok, fungsi, dan struktur organisasi Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang.',
    path: '/profile',
  },
  news: {
    title: 'Berita & Informasi Pengadaan — BPBJ Kota Semarang',
    description: 'Berita terkini seputar tender, regulasi pengadaan, kegiatan sosialisasi, dan informasi publik dari BPBJ Kota Semarang.',
    path: '/news',
  },
  gallery: {
    title: 'Galeri Kegiatan — BPBJ Kota Semarang',
    description: 'Dokumentasi visual kegiatan pengadaan barang dan jasa, rapat koordinasi, sosialisasi, dan bimbingan teknis BPBJ Kota Semarang.',
    path: '/gallery',
  },
  contact: {
    title: 'Hubungi Kami — BPBJ Kota Semarang',
    description: 'Hubungi Bagian Pengadaan Barang dan Jasa Kota Semarang. Alamat kantor, telepon, email, dan formulir kontak resmi.',
    path: '/contact',
  },
};

// Organization structured data
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang',
  alternateName: 'BPBJ Kota Semarang',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Pemuda No. 148, Gedung Moch Ichsan Lantai 6',
    addressLocality: 'Semarang',
    addressRegion: 'Jawa Tengah',
    postalCode: '50132',
    addressCountry: 'ID',
  },
  telephone: '(024) 3584000',
  email: 'bpbj@semarangkota.go.id',
  sameAs: [
    'https://www.instagram.com/bag.pengadaanbarangjasa.smg',
    'https://www.youtube.com/@bpbjkotasmg',
    'https://x.com/BpbjSemarang',
    'https://www.facebook.com/share/1B911jpwR9/',
  ],
};

// Website search action schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'id-ID',
  publisher: {
    '@type': 'GovernmentOrganization',
    name: 'BPBJ Kota Semarang',
  },
};

// Helper: generate BreadcrumbList schema
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${BASE_URL}${item.url}` : undefined,
    })),
  };
}

// Helper: generate Article schema for news detail
export function generateArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    image: article.image,
    datePublished: article.date,
    author: {
      '@type': 'Organization',
      name: 'BPBJ Kota Semarang',
    },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'BPBJ Kota Semarang',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/news/${article.id}`,
    },
  };
}

// Helper: generate FAQ schema for contact page
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Bagaimana cara mengakses layanan pengaduan BPBJ Kota Semarang?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Layanan pengaduan dapat diakses melalui portal bantuan.inaproc.id atau melalui formulir kontak di halaman Kontak website resmi BPBJ Kota Semarang.',
      },
    },
    {
      '@type': 'Question',
      name: 'Di mana alamat kantor BPBJ Kota Semarang?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kantor BPBJ Kota Semarang berlokasi di Jl. Pemuda No. 148, Gedung Moch Ichsan Lantai 6, Sekayu, Semarang Tengah, Kota Semarang.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apa jam operasional BPBJ Kota Semarang?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Senin - Kamis: 08.00 - 16.00 WIB, Jumat: 08.00 - 14.30 WIB.',
      },
    },
  ],
};
