/*
  Warnings:

  - You are about to drop the column `teacherName` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `lessionName` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonName` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_teacherName_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "teacherName",
ALTER COLUMN "duration" SET DATA TYPE TEXT,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "lessionName",
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "lessonName" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_key" ON "Enrollment"("userId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
