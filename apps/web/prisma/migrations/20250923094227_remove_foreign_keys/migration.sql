/*
  Warnings:

  - The values [CYCLE,MIDTERM,FINAL] on the enum `ExamType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rollNo` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[code]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ExamType_new" AS ENUM ('CYCLE_TEST', 'SEMESTER');
ALTER TABLE "public"."Exam" ALTER COLUMN "type" TYPE "public"."ExamType_new" USING ("type"::text::"public"."ExamType_new");
ALTER TYPE "public"."ExamType" RENAME TO "ExamType_old";
ALTER TYPE "public"."ExamType_new" RENAME TO "ExamType";
DROP TYPE "public"."ExamType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Mark" DROP CONSTRAINT "Mark_examId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Mark" DROP CONSTRAINT "Mark_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Mark" DROP CONSTRAINT "Mark_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_teacherId_fkey";

-- DropIndex
DROP INDEX "public"."Mark_studentId_subjectId_examId_key";

-- DropIndex
DROP INDEX "public"."Student_rollNo_key";

-- DropIndex
DROP INDEX "public"."Subject_name_key";

-- DropIndex
DROP INDEX "public"."User_studentId_key";

-- DropIndex
DROP INDEX "public"."User_teacherId_key";

-- AlterTable
ALTER TABLE "public"."Exam" DROP CONSTRAINT "Exam_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Exam_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Exam_id_seq";

-- AlterTable
ALTER TABLE "public"."Mark" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ALTER COLUMN "examId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "rollNo",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_id_seq";

-- AlterTable
ALTER TABLE "public"."Subject" DROP CONSTRAINT "Subject_pkey",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subject_id_seq";

-- AlterTable
ALTER TABLE "public"."Teacher" DROP CONSTRAINT "Teacher_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Teacher_id_seq";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "teacherId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "public"."Subject"("code");
