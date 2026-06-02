const SITE_NAME = 'BPBJ Kota Semarang';
const BASE_URL = 'https://bpbj.semarangkota.go.id';
const DEFAULT_OG_IMAGE = `${BASE_URL}/favicon.png`;
const SITE_DESCRIPTION = 'Portal resmi Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang. Informasi pengadaan, berita, galeri kegiatan, dan layanan kontak BPBJ Kota Semarang.';

export const seoConfig = {
  siteName: SITE_NAME,
  baseUrl: BASE_URL,
  defaultImage: DEFAULT_OG_IMAGE,
  defaultDescription: SITE_DESCRIPTION,
  locale: 'id_ID',
  twitterHandle: '@BpbjSemarang',
};

export const pageSEO = {
  home: {
    title: 'BPBJ Kota Semarang | Portal Pengadaan Barang dan Jasa',
    description: 'Portal resmi BPBJ Kota Semarang untuk informasi pengadaan barang dan jasa, berita kegiatan, galeri dokumentasi, serta layanan kontak dan pengaduan.',
    path: '/',
  },
  profile: {
    title: 'Profil BPBJ Kota Semarang | Visi, Misi, Tugas, dan Pegawai',
    description: 'Kenali profil BPBJ Kota Semarang, visi dan misi, tugas dan fungsi, struktur organisasi, serta direktori pegawai aktif.',
    path: '/profile',
  },
  news: {
    title: 'Berita Pengadaan | BPBJ Kota Semarang',
    description: 'Baca berita terbaru BPBJ Kota Semarang seputar pengadaan barang dan jasa, market sounding, sosialisasi, layanan, dan informasi publik.',
    path: '/news',
  },
  gallery: {
    title: 'Galeri Kegiatan | BPBJ Kota Semarang',
    description: 'Dokumentasi foto kegiatan BPBJ Kota Semarang, termasuk rapat koordinasi, sosialisasi pengadaan, bimbingan teknis, kunjungan kerja, dan penghargaan.',
    path: '/gallery',
  },
  contact: {
    title: 'Kontak BPBJ Kota Semarang | Alamat, Telepon, dan Pengaduan',
    description: 'Hubungi BPBJ Kota Semarang melalui alamat kantor, telepon, email resmi, peta lokasi, dan formulir kontak untuk pertanyaan atau pengaduan.',
    path: '/contact',
  },
  admin: {
    title: 'Admin BPBJ Kota Semarang',
    description: 'Panel administrasi BPBJ Kota Semarang.',
    path: '/admin',
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Semarang',
  alternateName: 'BPBJ Kota Semarang',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  image: DEFAULT_OG_IMAGE,
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Pemuda No. 148, Gedung Moch Ichsan Lantai 6',
    addressLocality: 'Semarang',
    addressRegion: 'Jawa Tengah',
    postalCode: '50132',
    addressCountry: 'ID',
  },
  telephone: '(024) 3513366',
  email: 'bpbj@semarangkota.go.id',
  sameAs: [
    'https://www.instagram.com/bag.pengadaanbarangjasa.smg',
    'https://www.youtube.com/@bpbjkotasmg',
    'https://x.com/BpbjSemarang',
  ],
};

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

export function generateArticleSchema(article) {
  const image = article.imageUrl || article.image || DEFAULT_OG_IMAGE;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || article.title,
    image,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    inLanguage: 'id-ID',
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

export function generateImageGallerySchema(item) {
  const images = Array.isArray(item.galleryImages) && item.galleryImages.length > 0
    ? item.galleryImages
    : item.imageUrl
      ? [{ imageUrl: item.imageUrl, imageAlt: item.imageAlt || item.title }]
      : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: item.title,
    description: item.description,
    url: `${BASE_URL}/gallery/${item.id}`,
    inLanguage: 'id-ID',
    image: images.map((image) => ({
      '@type': 'ImageObject',
      url: image.imageUrl,
      caption: image.imageAlt || item.title,
    })),
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'BPBJ Kota Semarang',
    },
  };
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Bagaimana cara menghubungi BPBJ Kota Semarang?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BPBJ Kota Semarang dapat dihubungi melalui telepon (024) 3513366, email bpbj@semarangkota.go.id, atau formulir kontak pada halaman Kontak.',
      },
    },
    {
      '@type': 'Question',
      name: 'Di mana alamat kantor BPBJ Kota Semarang?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kantor BPBJ Kota Semarang berlokasi di Jl. Pemuda No. 148, Gedung Moch Ichsan Lantai 6, Semarang.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apa saja informasi yang tersedia di website BPBJ Kota Semarang?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Website BPBJ Kota Semarang memuat profil instansi, berita pengadaan, galeri kegiatan, informasi kontak, dan layanan pengaduan.',
      },
    },
  ],
};
