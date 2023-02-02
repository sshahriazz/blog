/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `isDraft` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "coverImage",
DROP COLUMN "isDraft",
DROP COLUMN "isPublished",
ADD COLUMN     "cover" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "data" DROP NOT NULL,
ALTER COLUMN "data" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;
