/*
  Warnings:

  - A unique constraint covering the columns `[courseId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_courseId_key" ON "Comment"("courseId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
