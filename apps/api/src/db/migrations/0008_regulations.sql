CREATE TABLE IF NOT EXISTS "regulations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "category" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "link_url" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
