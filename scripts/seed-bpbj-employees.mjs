import pg from 'pg';

const { Pool } = pg;

const employees = [
  ['Nur Huda Iskandar, S.E., M.M.', 'Kepala Bagian Pengadaan Barang/Jasa'],
  ['Rimajantu Sadmoko, S.Kom.', 'Kepala Sub Bagian Pengelolaan Pengadaan Barang/Jasa'],
  ['Dian Adhari Saputra', 'Operator Layanan Operasional'],
  ['Bimo Bagus Setiyono', 'Pengadministrasi Perkantoran'],
  ['Pongky Melia Utarya Agung, A.Md', 'Pengelola Layanan Pengadaan'],
  ['Anik Alfiatun Rahmah, S.T.', 'Penelaah Teknis Kebijakan'],
  ['Sujiati Susilaningsih', 'Pengadministrasi Perkantoran'],
  ['Agung Hermanto, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Agus Jamaludin, S.H.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Ahmad Syaiful, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Angela Ria Karunia Putri Utama, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Ester Victorya Christiani, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Fuadah, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Harry Hermawan Saputro, S.Kom.', 'Pranata Komputer Ahli Pertama'],
  ['Indri Ayu Laxmita, S.T.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Listiyani Eka Putri, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Mella Nofantika, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Rafi Nanda Satrya, S.M.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Renna Gita Berliana, S.T.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Rizki Bayu Prakoso, S.Kom.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ["Siti Rufi'at Khoirunnisa, S.Kom.", 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Stella Nova Sari, S.T.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Wendi Darmarista, S.Kom.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Yudha Restu Anggara, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Arfan Kusumaputra, S.E., M.M.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Desy Kusumawati, S.E.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Dewi Margiastuti, S.Sos., M.T.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Dian Arianti, S.T.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Enong Wulan Juni, S.Kel.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Rama Sandi Pradhikta, S.H.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Tampi Pulung Putri, S.T., MPA', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Yunianto Budi Aristiya, S.T.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Nila Dewi Palupi, S.T.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Stephanus Teguh Herry Setyanto, S.T.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Sudarmono, S.E.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Titik Tri Sulistyaningsih, S.T.', 'Pengelola Pengadaan Barang/Jasa Muda'],
  ['Yunita Desy Purwarini, S.T.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Abdullah Kurnia Romadhlon, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Ardia Rahma Wardani, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Asti Purnama Sari, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Aulia Wulantika, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Dian Yulia Nastiti, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Eva Nahdhyatul Umah, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Ilma Karunia, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Mayasari Bekti Purwaningsih, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Muhamad Taufikurrohman, S.Kom.', 'Pranata Komputer Ahli Pertama'],
  ['Puji Wulansari, S.E.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ["Asy-Syifa' Surya Prayitna, S.Kom.", 'Pranata Komputer Ahli Pertama'],
  ['Cicilia Susi Ambarwati, S.T.', 'Pengelola Pengadaan Barang/Jasa Ahli Pertama'],
  ['Dwi Fajar Nugroho, S.T.', 'Perencana Ahli Pertama'],
  ['Galang Kurnia, S.T.', 'Perencana Ahli Pertama'],
  ['Nadhofatul Uliah, S.T.', 'Perencana Ahli Pertama'],
];

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bpbj_db';
const pool = new Pool({ connectionString: databaseUrl });

try {
  await pool.query('alter table employees alter column image_url drop not null');

  let inserted = 0;
  let updated = 0;

  for (const [index, [name, position]] of employees.entries()) {
    const existing = await pool.query('select id from employees where lower(name) = lower($1) limit 1', [name]);

    if (existing.rowCount) {
      await pool.query(
        `update employees
         set position = $2,
             display_order = $3,
             is_active = true,
             image_alt = coalesce(image_alt, $4),
             updated_at = now()
         where id = $1`,
        [existing.rows[0].id, position, index + 1, `Foto ${name}`],
      );
      updated += 1;
    } else {
      await pool.query(
        `insert into employees (name, position, quote, image_url, image_alt, display_order, is_active)
         values ($1, $2, null, null, $3, $4, true)`,
        [name, position, `Foto ${name}`, index + 1],
      );
      inserted += 1;
    }
  }

  await pool.query(
    'delete from employees where lower(name) <> all($1::text[])',
    [employees.map(([name]) => name.toLowerCase())],
  );

  console.log(JSON.stringify({ total: employees.length, inserted, updated }, null, 2));
} finally {
  await pool.end();
}
