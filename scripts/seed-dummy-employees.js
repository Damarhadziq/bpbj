const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bpbj_db';

const positions = [
  'Kepala Bagian Pengadaan Barang/Jasa',
  'Analis Kebijakan Ahli Muda',
  'Pengelola Pengadaan Barang/Jasa Ahli Muda',
  'Pengelola Pengadaan Barang/Jasa Ahli Pertama',
  'Pengadministrasi Umum',
  'Operator Layanan Pengadaan Secara Elektronik',
];

const names = [
  'Aditya Prakoso', 'Aisyah Rahmadani', 'Bagas Saputra', 'Citra Lestari', 'Damar Wicaksono',
  'Dewi Anggraini', 'Eka Pratama', 'Farah Nabila', 'Fikri Ramadhan', 'Gita Maharani',
  'Hadi Santoso', 'Intan Permatasari', 'Joko Pamungkas', 'Kania Safitri', 'Lukman Hakim',
  'Maya Puspita', 'Naufal Hidayat', 'Niken Amalia', 'Prasetyo Nugroho', 'Putri Wulandari',
  'Rafi Firmansyah', 'Ratna Sari', 'Rizky Maulana', 'Salsa Aprilia', 'Satria Wijaya',
  'Sekar Arum', 'Teguh Riyanto', 'Tiara Maharani', 'Vina Kartika', 'Wahyu Kurniawan',
  'Yudha Pranata', 'Zahra Aulia', 'Agus Setiawan', 'Anindya Kusuma', 'Bayu Wardhana',
  'Dian Pertiwi', 'Fajar Maulana', 'Hana Khairunnisa', 'Ilham Saputra', 'Kartika Dewi',
  'M. Reza Fahlevi', 'Nadia Oktaviani', 'Rangga Mahendra', 'Rina Marlina', 'Sinta Ayuningtyas',
  'Surya Baskara', 'Tania Kirana', 'Yoga Adinata', 'Zaki Mubarak', 'Nabila Putri',
];

const quotes = [
  'Berkomitmen menjaga layanan pengadaan yang tertib, terbuka, dan akuntabel.',
  'Mendukung proses kerja yang responsif untuk pelayanan publik yang lebih baik.',
  'Menguatkan kolaborasi agar setiap layanan berjalan rapi dan terpercaya.',
  'Hadir dengan semangat profesional dalam mendukung tata kelola pengadaan.',
  'Mendorong pelayanan yang cermat, transparan, dan berorientasi pada hasil.',
];

const femaleNamePattern = /(aisyah|citra|dewi|farah|gita|intan|kania|maya|niken|putri|salsa|sekar|tiara|vina|zahra|anindya|dian|hana|kartika|nadia|rina|sinta|tania|nabila)/i;
const formalPortraitIds = {
  men: [1, 5, 7, 8, 9, 10, 11, 12, 13, 15, 18, 19, 20, 22, 23, 25, 26, 28, 29, 30, 32, 33, 34, 35, 36, 37],
  women: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26],
};

function formalPortraitUrl(name, index) {
  const genderPath = femaleNamePattern.test(name) ? 'women' : 'men';
  const ids = formalPortraitIds[genderPath];
  const imageId = ids[index % ids.length];
  return `https://randomuser.me/api/portraits/${genderPath}/${imageId}.jpg`;
}

async function main() {
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    let inserted = 0;

    for (let index = 0; index < names.length; index += 1) {
      const name = names[index];
      const existing = await client.query('select id from employees where name = $1 limit 1', [name]);

      if (existing.rowCount > 0) continue;

      await client.query(
        `insert into employees (name, position, quote, image_url, image_alt, display_order, is_active, created_at, updated_at)
         values ($1, $2, $3, $4, $5, $6, $7, now(), now())`,
        [
          name,
          positions[index % positions.length],
          quotes[index % quotes.length],
          formalPortraitUrl(name, index),
          `Foto formal ${name}`,
          index + 1,
          index % 9 !== 0,
        ]
      );
      inserted += 1;
    }

    const total = await client.query('select count(*)::int as value from employees');
    console.log(`Inserted ${inserted} dummy employees. Total employees: ${total.rows[0].value}.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
