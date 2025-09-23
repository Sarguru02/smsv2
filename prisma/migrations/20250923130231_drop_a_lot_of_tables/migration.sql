/*
  Warnings:

  - The primary key for the `Mark` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `examId` on the `Mark` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Mark` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Mark` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rollNo]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `examName` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marks` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollNo` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Mark" DROP CONSTRAINT "Mark_pkey",
DROP COLUMN "examId",
DROP COLUMN "score",
DROP COLUMN "subjectId",
ADD COLUMN     "examName" TEXT NOT NULL,
ADD COLUMN     "marks" JSONB NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mark_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Mark_id_seq";

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "class" TEXT,
ADD COLUMN     "rollNo" TEXT NOT NULL,
ADD COLUMN     "section" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "studentId",
DROP COLUMN "teacherId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "public"."Exam";

-- DropTable
DROP TABLE "public"."Subject";

-- DropTable
DROP TABLE "public"."Teacher";

-- DropEnum
DROP TYPE "public"."ExamType";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_key" ON "public"."Student"("rollNo");
