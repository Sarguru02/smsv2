import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { StudentInputSchema, UserRole } from "@/lib/types";
import { z } from "zod";
import { StudentQueries } from "@/lib/db/student.queries";
import { AuthService } from "@/lib/auth";
import { JobQueries } from "@/lib/db/job.queries";

const studentBatchUploadSchema = z.object({
  jobId: z.string().min(1),
  students: z.array(StudentInputSchema)
})
async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, students } = studentBatchUploadSchema.parse(body);

    const createStudentsResult = await StudentQueries.createManyStudents(students);

    const createUsersInput = students.map(s => ({
      username: s.rollNo,
      password: s.rollNo,
      role: "STUDENT" as UserRole
    }))
    const createUsersResult = await AuthService.createManyUsers(createUsersInput);
    
    const job = await JobQueries.getJobById(jobId);
    const processedRows = job?.processedRows ?? 0;

    if(job?.totalRows === processedRows + students.length){
      await JobQueries.updateStatus(jobId, "completed");
      await JobQueries.updateProcessedRows(jobId, students.length);
    }

    return NextResponse.json({
      success: true, 
      message: `Inserted ${createStudentsResult.count} students, and ${createUsersResult.count} users.`,
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
