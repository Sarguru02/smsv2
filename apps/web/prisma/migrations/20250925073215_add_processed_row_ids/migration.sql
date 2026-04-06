-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "errorStatus" JSONB,
ADD COLUMN     "processedRowIds" JSONB;
