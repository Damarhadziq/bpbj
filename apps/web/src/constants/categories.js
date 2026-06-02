export const NEWS_CATEGORY_ALL = 'Semua';
export const NEWS_CATEGORIES = ['Informasi', 'Kegiatan', 'Layanan', 'Sosialisasi', 'Market Sounding'];

export const GALLERY_CATEGORY_ALL = 'Semua Kegiatan';
export const GALLERY_CATEGORIES = [
  'Rapat Koordinasi',
  'Sosialisasi Pengadaan',
  'Bimbingan Teknis',
  'Kunjungan Kerja',
  'Penghargaan',
];

const normalizeCategory = (category = '') => category.trim().toLowerCase();

const NEWS_CATEGORY_ALIASES = {
  informasi: 'Informasi',
  pengumuman: 'Informasi',
  kegiatan: 'Kegiatan',
  layanan: 'Layanan',
  sosialisasi: 'Sosialisasi',
  tender: 'Sosialisasi',
  'market sounding': 'Market Sounding',
};

const GALLERY_CATEGORY_ALIASES = {
  'rapat koordinasi': 'Rapat Koordinasi',
  koordinasi: 'Rapat Koordinasi',
  'sosialisasi pengadaan': 'Sosialisasi Pengadaan',
  sosialisasi: 'Sosialisasi Pengadaan',
  'bimbingan teknis': 'Bimbingan Teknis',
  pelatihan: 'Bimbingan Teknis',
  'kunjungan kerja': 'Kunjungan Kerja',
  penghargaan: 'Penghargaan',
};

export const getNewsCategory = (category) => NEWS_CATEGORY_ALIASES[normalizeCategory(category)] || category;

export const getGalleryCategory = (category) => GALLERY_CATEGORY_ALIASES[normalizeCategory(category)] || category;

export const newsCategoryMatches = (itemCategory, selectedCategory) => (
  selectedCategory === NEWS_CATEGORY_ALL || getNewsCategory(itemCategory) === selectedCategory
);

export const galleryCategoryMatches = (itemCategory, selectedCategory) => (
  selectedCategory === GALLERY_CATEGORY_ALL || getGalleryCategory(itemCategory) === selectedCategory
);
