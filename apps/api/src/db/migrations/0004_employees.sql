CREATE TABLE IF NOT EXISTS "employees" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "position" varchar(255) NOT NULL,
  "image_url" text NOT NULL,
  "image_alt" varchar(255),
  "display_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
