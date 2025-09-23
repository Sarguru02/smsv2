-- AlterTable
ALTER TABLE "public"."Exam" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Mark" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Subject" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Teacher" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "createdAt" DROP DEFAULT;
