/*
  Warnings:

  - Added the required column `fileName` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userID" TEXT NOT NULL;
