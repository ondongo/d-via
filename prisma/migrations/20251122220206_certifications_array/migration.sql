-- AlterTable
-- Change certifications from String? to String[]
-- Note: This will drop existing data in the certifications column
ALTER TABLE "Artisan" DROP COLUMN IF EXISTS "certifications";
ALTER TABLE "Artisan" ADD COLUMN "certifications" TEXT[];



