-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacher_id_fkey";

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "teacher_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "subjects" TEXT[];
