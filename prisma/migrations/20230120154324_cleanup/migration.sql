/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaSocial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_blogId_fkey";

-- DropForeignKey
ALTER TABLE "MetaSocial" DROP CONSTRAINT "MetaSocial_seoId_fkey";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "MetaSocial";

-- DropTable
DROP TABLE "Seo";
