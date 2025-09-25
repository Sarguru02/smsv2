import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { MarkInputSchema } from "@/lib/types";
import { z } from "zod";
import { JobQueries } from "@/lib/db/job.queries";
import { MarksQueries } from "@/lib/db/marks.queries";

const markBatchUploadSchema = z.object({
  jobId: z.string().min(1),
  markRows: z.array(MarkInputSchema)
})
async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, markRows } = markBatchUploadSchema.parse(body);

    const createMarksResult = await MarksQueries.createManyMarks(markRows);

    const job = await JobQueries.getJobById(jobId);
    const processedRows = job?.processedRows ?? 0;

    if (job?.totalRows === processedRows + markRows.length) {
      const processedRowIds = markRows.map(m => m.rollNo);
      const job = await JobQueries.updateStatus(jobId, "completed");
      await JobQueries.updateProcessedRows(jobId, markRows.length);
      await JobQueries.updateProcessedRowIds(jobId, [...job?.processedRowIds as string[], ...processedRowIds]);
    }

    return NextResponse.json({
      success: true,
      message: `Inserted ${createMarksResult.count} students' marks.`,
      status: 200
    })
  } catch (err) {
    console.error("Error in marks batch upload:", err);
    
    const body = await req.json().catch(() => ({}));
    const jobId = body.jobId;
    
    if (jobId) {
      const errorDetails = {
        message: err instanceof Error ? err.message : "Unknown error occurred during marks batch upload",
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        context: "marks_batch_upload"
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

export const POST = verifySignatureAppRouter(handler);
