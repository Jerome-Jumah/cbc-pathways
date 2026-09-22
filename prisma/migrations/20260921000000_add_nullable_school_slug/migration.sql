ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "slug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "schools_slug_key" ON "schools" ("slug");
