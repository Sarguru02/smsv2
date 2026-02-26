import { NextRequest, NextResponse } from "next/server";
import { MarkInputSchema } from "@/lib/types";
import { z } from "zod";
import { JobQueries } from "@/lib/db/job.queries";
import { MarksQueries } from "@/lib/db/marks.queries";
import { updateProcessedRowsWithIds } from "@/services/job.service";
import { Prisma } from "@/generated/prisma/client";
import { qstashWrapper } from "@/lib/qstash";

const markBatchUploadSchema = z.object({
  jobId: z.string().min(1),
  markRows: z.array(MarkInputSchema)
})
async function handler(req: NextRequest) {
  let body: z.infer<typeof markBatchUploadSchema> | undefined;
  try {
    body = markBatchUploadSchema.parse(await req.json());
    const { jobId, markRows } = body;

    const createMarksResult = await MarksQueries.createManyMarks(markRows);
    await updateProcessedRowsWithIds(jobId, createMarksResult.count, markRows.map(m => m.rollNo));

    return NextResponse.json({
      success: true,
      message: `Inserted ${createMarksResult.count} students' marks.`,
      status: 200
    })
  } catch (err) {
    console.error("Error in marks batch upload:", err);

    const jobId = body?.jobId;

    if (jobId) {
      let errorMessage = "Unknown error occurred during marks batch upload";
      let errorContext = "marks_batch_upload";

      // Handle specific Prisma errors
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            errorMessage = `Duplicate marks entry detected: ${err.meta?.target ? `duplicate ${err.meta.target}` : 'unique constraint violation'}`;
            errorContext = "prisma_unique_constraint_violation";
            break;
          case 'P2003':
            errorMessage = "Foreign key constraint failed - student not found";
            errorContext = "prisma_foreign_key_constraint";
            break;
          case 'P2025':
            errorMessage = "Student record not found for marks entry";
            errorContext = "prisma_record_not_found";
            break;
          default:
            errorMessage = `Database error (${err.code}): ${err.message}`;
            errorContext = "prisma_known_request_error";
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        errorMessage = "Database validation error: Invalid marks data format";
        errorContext = "prisma_validation_error";
      } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        errorMessage = "Unknown database error occurred during marks upload";
        errorContext = "prisma_unknown_request_error";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      const errorDetails = {
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        context: errorContext,
        prismaCode: err instanceof Prisma.PrismaClientKnownRequestError ? err.code : undefined
      };

      await JobQueries.updateStatusWithError(jobId, "failed", errorDetails);
    }

    return NextResponse.json({
      success: false,
      error: "Failed to process marks batch upload",
      status: 500
    }, { status: 500 })
  }
}

export const POST = qstashWrapper(handler);
