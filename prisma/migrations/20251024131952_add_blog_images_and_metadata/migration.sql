-- AlterTable
ALTER TABLE "public"."Blog" ADD COLUMN     "author" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "previewImage" TEXT,
ADD COLUMN     "tags" TEXT[];
