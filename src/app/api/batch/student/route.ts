import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { StudentInputSchema } from "@/lib/types";
import { z } from "zod";
import { JobQueries } from "@/lib/db/job.queries";
import { createManyStudentsWithUsers } from "@/services/batchStudent.service";
import { updateProcessedRowsWithIds } from "@/services/job.service";

const studentBatchUploadSchema = z.object({
  jobId: z.string().min(1),
  students: z.array(StudentInputSchema)
})
async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, students } = studentBatchUploadSchema.parse(body);

    const createStudentsResult = await createManyStudentsWithUsers(students);
    await updateProcessedRowsWithIds(jobId, students.length, students.map(s => s.rollNo));

    return NextResponse.json({
      success: true,
      message: `Inserted ${createStudentsResult.studentsInserted} students, and ${createStudentsResult.usersInserted} users.`,
      status: 200
    })
  } catch (err) {
    console.error("Error in student batch upload:", err);

    const body = await req.json().catch(() => ({}));
    const jobId = body.jobId;

    if (jobId) {
      const errorDetails = {
        message: err instanceof Error ? err.message : "Unknown error occurred during student batch upload",
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        context: "student_batch_upload"
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
