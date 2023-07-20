/*
  Warnings:

  - You are about to drop the column `comment` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "comment",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";
