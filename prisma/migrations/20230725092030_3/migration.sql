/*
  Warnings:

  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- DropIndex
DROP INDEX "Course_userId_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "userId";
