import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { MarkInputSchema } from "@/lib/types";
import { z } from "zod";
import { JobQueries } from "@/lib/db/job.queries";
import { MarksQueries } from "@/lib/db/marks.queries";
import { updateProcessedRowsWithIds } from "@/services/job.service";

const markBatchUploadSchema = z.object({
  jobId: z.string().min(1),
  markRows: z.array(MarkInputSchema)
})
async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, markRows } = markBatchUploadSchema.parse(body);

    const createMarksResult = await MarksQueries.createManyMarks(markRows);
    await updateProcessedRowsWithIds(jobId, createMarksResult.count, markRows.map(m => m.rollNo));

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
