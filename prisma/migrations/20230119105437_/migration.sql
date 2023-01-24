/*
  Warnings:

  - You are about to drop the column `blogId` on the `Seo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seo" DROP CONSTRAINT "Seo_blogId_fkey";

-- DropIndex
DROP INDEX "Seo_blogId_key";

-- AlterTable
ALTER TABLE "Seo" DROP COLUMN "blogId";
