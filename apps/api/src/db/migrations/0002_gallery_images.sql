ALTER TABLE "gallery" ADD COLUMN IF NOT EXISTS "gallery_images" jsonb;--> statement-breakpoint
UPDATE "gallery"
SET "gallery_images" = jsonb_build_array(
  jsonb_build_object(
    'imageUrl', "image_url",
    'imageAlt', COALESCE("image_alt", "title"),
    'isCover', true
  )
)
WHERE "gallery_images" IS NULL
  AND "image_url" IS NOT NULL;
