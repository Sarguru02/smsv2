import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { StudentInputSchema } from "@/lib/types";
import { z } from "zod";
import { JobQueries } from "@/lib/db/job.queries";
import { createManyStudentsWithUsers } from "@/services/batchStudent.service";
import { updateProcessedRowsWithIds } from "@/services/job.service";
import { Prisma } from "@/generated/prisma/client";

const studentBatchUploadSchema = z.object({
  jobId: z.string().min(1),
  students: z.array(StudentInputSchema)
})
async function handler(req: NextRequest) {
  let body: z.infer<typeof studentBatchUploadSchema> | undefined;
  try {
    body = studentBatchUploadSchema.parse(await req.json());
    const { jobId, students } = body;

    const createStudentsResult = await createManyStudentsWithUsers(students);
    await updateProcessedRowsWithIds(jobId, students.length, students.map(s => s.rollNo));

    return NextResponse.json({
      success: true,
      message: `Inserted ${createStudentsResult.studentsInserted} students, and ${createStudentsResult.usersInserted} users.`,
      status: 200
    })
  } catch (err) {
    console.error("Error in student batch upload:", err);

    const jobId = body?.jobId;

    if (jobId) {
      let errorMessage = "Unknown error occurred during student batch upload";
      let errorContext = "student_batch_upload";

      // Handle specific Prisma errors
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            errorMessage = `Duplicate entry detected: ${err.meta?.target ? `duplicate ${err.meta.target}` : 'unique constraint violation'}`;
            errorContext = "prisma_unique_constraint_violation";
            break;
          case 'P2003':
            errorMessage = "Foreign key constraint failed";
            errorContext = "prisma_foreign_key_constraint";
            break;
          case 'P2025':
            errorMessage = "Record not found or required relation missing";
            errorContext = "prisma_record_not_found";
            break;
          default:
            errorMessage = `Database error (${err.code}): ${err.message}`;
            errorContext = "prisma_known_request_error";
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        errorMessage = "Database validation error: Invalid data format";
        errorContext = "prisma_validation_error";
      } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        errorMessage = "Unknown database error occurred";
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
      error: "Failed to process student batch upload",
      status: 500
    }, { status: 500 })
  }
}

export const POST = verifySignatureAppRouter(handler);
