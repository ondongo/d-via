-- AlterTable
-- Remove photos column
ALTER TABLE "Artisan" DROP COLUMN IF EXISTS "photos";

-- Add workPhotos and professionalGuarantees columns
ALTER TABLE "Artisan" ADD COLUMN IF NOT EXISTS "workPhotos" TEXT[];
ALTER TABLE "Artisan" ADD COLUMN IF NOT EXISTS "professionalGuarantees" TEXT[];

-- Modify certifications to be names only, add certificationUrls for file URLs
-- Note: This will drop existing data in the certifications column
ALTER TABLE "Artisan" DROP COLUMN IF EXISTS "certifications";
ALTER TABLE "Artisan" ADD COLUMN "certifications" TEXT[]; -- Names of certifications (RGE, Qualibat, etc.)
ALTER TABLE "Artisan" ADD COLUMN IF NOT EXISTS "certificationUrls" TEXT[]; -- URLs of certification files
