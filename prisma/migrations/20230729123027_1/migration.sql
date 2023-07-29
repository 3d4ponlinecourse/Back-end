-- DropIndex
DROP INDEX "Enrollment_userId_key";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "videoUrl" DROP NOT NULL;
