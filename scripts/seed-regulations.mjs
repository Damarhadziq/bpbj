import pg from 'pg';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bpbj_db';

const regulations = [
  {
    title: 'Perpres Nomor 16 Tahun 2018',
    category: 'Peraturan Presiden',
    description: 'Dasar pengaturan Pengadaan Barang/Jasa Pemerintah yang menjadi rujukan utama proses pengadaan di kementerian, lembaga, dan pemerintah daerah.',
    linkUrl: 'https://peraturan.bpk.go.id/Details/73586/perpres-no-16-tahun-2018',
  },
  {
    title: 'Perpres Nomor 12 Tahun 2021',
    category: 'Peraturan Presiden',
    description: 'Perubahan atas Perpres Nomor 16 Tahun 2018 yang menyesuaikan ketentuan pengadaan, dukungan UMK dan koperasi, serta pengadaan jasa konstruksi.',
    linkUrl: 'https://peraturan.bpk.go.id/Home/Details/161828/perpres-no-12-tahun-2021',
  },
  {
    title: 'Perpres Nomor 46 Tahun 2025',
    category: 'Peraturan Presiden',
    description: 'Perubahan kedua atas Perpres Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagai pembaruan terbaru kerangka regulasi nasional.',
    linkUrl: 'https://peraturan.bpk.go.id/Details/318647',
  },
  {
    title: 'Peraturan LKPP Nomor 11 Tahun 2021',
    category: 'Peraturan LKPP',
    description: 'Pedoman perencanaan pengadaan barang/jasa pemerintah sebagai acuan penyusunan kebutuhan dan rencana pengadaan.',
    linkUrl: 'https://jdih.lkpp.go.id/regulation/peraturanlkpp/peraturan-lkpp-nomor-11-tahun-2021',
  },
  {
    title: 'Peraturan LKPP Nomor 12 Tahun 2021',
    category: 'Peraturan LKPP',
    description: 'Pedoman pelaksanaan pengadaan barang/jasa pemerintah melalui penyedia sesuai kerangka Perpres pengadaan barang/jasa pemerintah.',
    linkUrl: 'https://jdih.lkpp.go.id/regulation/peraturanlkpp/peraturan-lkpp-nomor-12-tahun-2021',
  },
  {
    title: 'Peraturan LKPP Nomor 3 Tahun 2021',
    category: 'Peraturan LKPP',
    description: 'Pedoman swakelola dalam pengadaan barang/jasa pemerintah, termasuk pengaturan penyelenggara, tim persiapan, pelaksana, dan pengawas.',
    linkUrl: 'https://jdih.lkpp.go.id/regulation/peraturan-lkpp/peraturan-lkpp-nomor-3-tahun-2021',
  },
  {
    title: 'Peraturan LKPP Nomor 5 Tahun 2021',
    category: 'Peraturan LKPP',
    description: 'Pedoman pengadaan barang/jasa yang dikecualikan pada pengadaan barang/jasa pemerintah.',
    linkUrl: 'https://jdih.lkpp.go.id/regulation/peraturan-lkpp/peraturan-lkpp-nomor-5-tahun-2021',
  },
  {
    title: 'Peraturan LKPP Nomor 4 Tahun 2024',
    category: 'Peraturan LKPP',
    description: 'Perubahan atas Peraturan LKPP Nomor 12 Tahun 2021 tentang pedoman pelaksanaan pengadaan barang/jasa pemerintah melalui penyedia.',
    linkUrl: 'https://jdih.lkpp.go.id/regulation/peraturan-lkpp/peraturan-lkpp-nomor-4-tahun-2024',
  },
];

const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  await pool.query(`
    create table if not exists regulations (
      id uuid primary key default gen_random_uuid(),
      title varchar(255) not null,
      category varchar(100) not null,
      description text not null,
      link_url text,
      display_order integer not null default 0,
      is_active boolean not null default true,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    )
  `);

  let inserted = 0;
  let updated = 0;

  for (const [index, item] of regulations.entries()) {
    const existing = await pool.query('select id from regulations where lower(title) = lower($1) limit 1', [item.title]);
    const values = [item.title, item.category, item.description, item.linkUrl, index + 1, true];

    if (existing.rowCount) {
      await pool.query(
        `update regulations
         set category = $2,
             description = $3,
             link_url = $4,
             display_order = $5,
             is_active = $6,
             updated_at = now()
         where lower(title) = lower($1)`,
        values,
      );
      updated += 1;
    } else {
      await pool.query(
        `insert into regulations (title, category, description, link_url, display_order, is_active)
         values ($1, $2, $3, $4, $5, $6)`,
        values,
      );
      inserted += 1;
    }
  }

  console.log(JSON.stringify({ total: regulations.length, inserted, updated }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
