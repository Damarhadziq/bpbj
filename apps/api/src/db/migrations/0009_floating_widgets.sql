CREATE TABLE IF NOT EXISTS "floating_widgets" (
  "id" uuid PRIMARY KEY NOT NULL,
  "label" varchar(100) NOT NULL,
  "description" varchar(255) NOT NULL,
  "href" text NOT NULL,
  "image_url" text,
  "icon" varchar(80),
  "display_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "open_in_new_tab" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "floating_widgets" ("label", "description", "href", "icon", "display_order", "is_active", "open_in_new_tab")
SELECT 'Laporsemar', 'Laporkan aspirasi atau pengaduan melalui Lapor Semar', 'https://lapor.semarangkota.go.id', 'campaign', 1, true, true
WHERE NOT EXISTS (SELECT 1 FROM "floating_widgets" WHERE "label" = 'Laporsemar');

INSERT INTO "floating_widgets" ("label", "description", "href", "icon", "display_order", "is_active", "open_in_new_tab")
SELECT 'Pengaduan BPBJ', 'Kirim pengaduan langsung ke BPBJ Kota Semarang', '/contact#pengaduan', 'forum', 2, true, false
WHERE NOT EXISTS (SELECT 1 FROM "floating_widgets" WHERE "label" = 'Pengaduan BPBJ');

INSERT INTO "floating_widgets" ("label", "description", "href", "icon", "display_order", "is_active", "open_in_new_tab")
SELECT 'Kontak BPBJ', 'Lihat alamat, email, dan nomor telepon BPBJ', '/contact', 'support_agent', 3, true, false
WHERE NOT EXISTS (SELECT 1 FROM "floating_widgets" WHERE "label" = 'Kontak BPBJ');
