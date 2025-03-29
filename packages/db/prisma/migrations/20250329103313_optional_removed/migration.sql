/*
  Warnings:

  - Made the column `name` on table `Batch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Subject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Batch" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "password" SET NOT NULL;
