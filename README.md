# Website BPBJ Kota Semarang

Aplikasi website resmi BPBJ Kota Semarang berbentuk monorepo yang berisi frontend publik/admin dan backend API. Frontend dibangun sebagai static site, sedangkan backend berjalan sebagai service Node.js yang terhubung ke PostgreSQL.

## Ringkasan Aplikasi

Website ini memiliki dua area utama:

- Website publik untuk menampilkan beranda, profil, berita, galeri, kontak, regulasi, pegawai, carousel, service link, dan floating widget.
- CMS/admin untuk mengelola konten website, termasuk berita, galeri, carousel, service link, pegawai, regulasi, sambutan kepala, kontak masuk, user admin, dan floating widget.

Alur dasar aplikasi:

1. Pengunjung membuka frontend React.
2. Frontend mengambil data dari backend melalui endpoint `/api/v1`.
3. Backend membaca/menulis data ke PostgreSQL memakai Drizzle ORM.
4. Admin login melalui Better Auth.
5. Admin mengelola konten dari halaman `/admin`.
6. Perubahan konten tersimpan di PostgreSQL dan langsung dipakai oleh website publik.

## Tech Stack

- Monorepo: npm workspaces
- Frontend: React 19, Vite 8, React Router, TanStack Query, Axios, Tailwind CSS
- Backend: Node.js, Express 5, TypeScript
- Auth: Better Auth
- Database: PostgreSQL, Drizzle ORM
- Deployment VPS: Nginx reverse proxy, PM2, Node.js, PostgreSQL, Certbot SSL

## Struktur Project

```text
.
+-- apps
|   +-- api              # Backend Express + TypeScript
|   |   +-- src
|   |   |   +-- auth
|   |   |   +-- config
|   |   |   +-- db
|   |   |   +-- middlewares
|   |   |   +-- routes
|   |   |   +-- utils
|   |   +-- package.json
|   +-- web              # Frontend React + Vite
|       +-- src
|       |   +-- components
|       |   +-- hooks
|       |   +-- pages
|       |   +-- services
|       |   +-- assets
|       +-- package.json
+-- scripts              # Script helper database/deploy
+-- docker-compose.yml   # PostgreSQL lokal untuk development
+-- package.json
+-- package-lock.json
```

## Endpoint Utama

Base API default:

```text
https://api.domain.go.id/api/v1
```

Endpoint yang tersedia:

- `GET /api/v1/health`
- `/api/v1/auth`
- `/api/v1/welcome-message`
- `/api/v1/news`
- `/api/v1/gallery`
- `/api/v1/contacts`
- `/api/v1/users`
- `/api/v1/carousel`
- `/api/v1/analytics`
- `/api/v1/service-links`
- `/api/v1/floating-widgets`
- `/api/v1/employees`
- `/api/v1/regulations`

## Environment

### Backend

Buat file `apps/api/.env` dari contoh `apps/api/.env.example`.

```env
PORT=4000
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@localhost:5432/DB_NAME
FRONTEND_URL=https://bpbj.semarangkota.go.id
BETTER_AUTH_URL=https://api.bpbj.semarangkota.go.id
BETTER_AUTH_SECRET=replace-with-a-long-random-secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password_email_anda
SMTP_FROM=user@example.com
SMTP_SECURE=false
```

Catatan:

- `FRONTEND_URL` adalah domain frontend yang boleh mengakses API.
- `BETTER_AUTH_URL` adalah domain backend/API.
- `BETTER_AUTH_SECRET` wajib diganti dengan random string panjang di production.
- SMTP bersifat opsional, dipakai untuk fitur balasan email jika dikonfigurasi.

### Frontend

Buat file `apps/web/.env.production` dari contoh `apps/web/.env.example`.

```env
VITE_API_BASE_URL=https://api.bpbj.semarangkota.go.id/api/v1
```

Nilai ini akan tertanam saat menjalankan build frontend.

## Development Lokal

Install dependencies dari root project:

```bash
npm install
```

Jalankan PostgreSQL lokal:

```bash
docker compose up -d
```

Jalankan backend:

```bash
cd apps/api
npm run dev
```

Jalankan frontend:

```bash
cd apps/web
npm run dev -- --host 127.0.0.1
```

Default lokal:

- Frontend: `http://127.0.0.1:5175` atau port Vite yang tersedia
- Backend: `http://localhost:4000`
- Database: `localhost:5432`

## Build Production

Build backend:

```bash
cd apps/api
npm run build
```

Output backend:

```text
apps/api/dist
```

Build frontend:

```bash
cd apps/web
npm run build
```

Output frontend:

```text
apps/web/dist
```

## Deploy ke VPS

Contoh ini memakai Ubuntu, Nginx, PM2, PostgreSQL, dan dua domain:

- Frontend: `bpbj.semarangkota.go.id`
- API: `api.bpbj.semarangkota.go.id`

Sesuaikan domain dengan kondisi VPS.

### 1. Install Paket Server

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib git curl
```

Install Node.js LTS, contoh via NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2:

```bash
sudo npm install -g pm2
```

### 2. Siapkan Database PostgreSQL

Masuk ke PostgreSQL:

```bash
sudo -u postgres psql
```

Buat user dan database:

```sql
CREATE USER bpbj_user WITH PASSWORD 'password_yang_kuat';
CREATE DATABASE bpbj_db OWNER bpbj_user;
GRANT ALL PRIVILEGES ON DATABASE bpbj_db TO bpbj_user;
\q
```

Import database jika sudah punya dump final:

```bash
psql "postgresql://bpbj_user:password_yang_kuat@localhost:5432/bpbj_db" < compatible_import.sql
```

File `compatible_import.sql` sudah disiapkan agar lebih aman untuk hosting yang membatasi role, owner, extension, dan privilege.

### 3. Upload Project ke VPS

Opsi Git:

```bash
cd /var/www
sudo git clone REPOSITORY_URL bpbj
sudo chown -R $USER:$USER /var/www/bpbj
cd /var/www/bpbj
npm install
```

Opsi manual:

1. Zip folder project.
2. Upload ke VPS memakai SFTP.
3. Extract ke `/var/www/bpbj`.
4. Jalankan `npm install` dari root project.

Jangan upload folder `node_modules`, file `.env`, file log, dan dump SQL percobaan.

### 4. Konfigurasi Backend

Buat file env production:

```bash
cd /var/www/bpbj/apps/api
cp .env.example .env
nano .env
```

Contoh isi production:

```env
PORT=4000
DATABASE_URL=postgresql://bpbj_user:password_yang_kuat@localhost:5432/bpbj_db
FRONTEND_URL=https://bpbj.semarangkota.go.id
BETTER_AUTH_URL=https://api.bpbj.semarangkota.go.id
BETTER_AUTH_SECRET=random_string_panjang
```

Build dan jalankan backend:

```bash
npm run build
pm2 start dist/index.js --name bpbj-api
pm2 save
pm2 startup
```

Cek API:

```bash
curl http://127.0.0.1:4000/api/v1/health
```

### 5. Konfigurasi Frontend

Buat env production:

```bash
cd /var/www/bpbj/apps/web
cp .env.example .env.production
nano .env.production
```

Isi:

```env
VITE_API_BASE_URL=https://api.bpbj.semarangkota.go.id/api/v1
```

Build frontend:

```bash
npm run build
```

Copy hasil build ke folder web server:

```bash
sudo mkdir -p /var/www/bpbj-web
sudo rsync -av --delete dist/ /var/www/bpbj-web/
sudo chown -R www-data:www-data /var/www/bpbj-web
```

### 6. Konfigurasi Nginx

Buat konfigurasi frontend:

```bash
sudo nano /etc/nginx/sites-available/bpbj-web
```

Isi:

```nginx
server {
    listen 80;
    server_name bpbj.semarangkota.go.id;

    root /var/www/bpbj-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Buat konfigurasi API:

```bash
sudo nano /etc/nginx/sites-available/bpbj-api
```

Isi:

```nginx
server {
    listen 80;
    server_name api.bpbj.semarangkota.go.id;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi:

```bash
sudo ln -s /etc/nginx/sites-available/bpbj-web /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/bpbj-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL HTTPS

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Generate SSL:

```bash
sudo certbot --nginx -d bpbj.semarangkota.go.id -d api.bpbj.semarangkota.go.id
```

Cek auto-renew:

```bash
sudo certbot renew --dry-run
```

### 8. Update Deploy Setelah Ada Perubahan

Pull kode terbaru:

```bash
cd /var/www/bpbj
git pull
npm install
```

Rebuild backend:

```bash
cd /var/www/bpbj/apps/api
npm run build
pm2 restart bpbj-api
```

Rebuild frontend:

```bash
cd /var/www/bpbj/apps/web
npm run build
sudo rsync -av --delete dist/ /var/www/bpbj-web/
```

## Checklist Setelah Deploy

- Buka `https://api.bpbj.semarangkota.go.id/api/v1/health`.
- Buka `https://bpbj.semarangkota.go.id`.
- Cek halaman publik: Beranda, Profil, Berita, Galeri, Kontak.
- Login ke `/admin/login`.
- Coba tambah/edit konten dari admin.
- Cek floating widget muncul di kanan bawah.
- Cek console browser tidak ada error CORS.
- Cek log backend dengan `pm2 logs bpbj-api`.

## Troubleshooting

### API tidak bisa diakses

Cek service PM2:

```bash
pm2 status
pm2 logs bpbj-api
```

Cek port backend:

```bash
curl http://127.0.0.1:4000/api/v1/health
```

### Error CORS atau login gagal

Pastikan `FRONTEND_URL` di `apps/api/.env` sama dengan domain frontend production:

```env
FRONTEND_URL=https://bpbj.semarangkota.go.id
```

Pastikan `BETTER_AUTH_URL` sama dengan domain API:

```env
BETTER_AUTH_URL=https://api.bpbj.semarangkota.go.id
```

Restart API setelah mengubah env:

```bash
pm2 restart bpbj-api
```

### Frontend masih mengarah ke API lama

Ubah `apps/web/.env.production`, lalu build ulang frontend:

```bash
cd /var/www/bpbj/apps/web
npm run build
sudo rsync -av --delete dist/ /var/www/bpbj-web/
```

### Refresh halaman React menghasilkan 404

Pastikan Nginx frontend memakai:

```nginx
try_files $uri $uri/ /index.html;
```

### Database error role, owner, extension, atau privilege

Gunakan `compatible_import.sql`, bukan dump mentah. Jika perlu generate ulang dari dump PostgreSQL:

```bash
python scripts/make_pg_dump_cpanel_compatible.py bpbj_db_dump.sql compatible_import.sql
```

## Catatan Keamanan

- Jangan commit file `.env`.
- Gunakan password database yang kuat.
- Gunakan `BETTER_AUTH_SECRET` random panjang.
- Batasi akses database hanya dari localhost jika API dan database berada di VPS yang sama.
- Aktifkan firewall untuk membuka hanya port 80, 443, dan SSH.
- Backup database secara berkala.
