/*
  Warnings:

  - Made the column `class` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `section` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Job" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "class" SET NOT NULL,
ALTER COLUMN "section" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "maxMarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);
