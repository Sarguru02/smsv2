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
  const body = await req.json();
  const { jobId, markRows } = markBatchUploadSchema.parse(body);

  const createMarksResult = await MarksQueries.createManyMarks(markRows);

  const job = await JobQueries.getJobById(jobId);
  const processedRows = job?.processedRows ?? 0;

  if (job?.totalRows === processedRows + markRows.length) {
    await JobQueries.updateStatus(jobId, "completed");
    await JobQueries.updateProcessedRows(jobId, markRows.length);
  }

  return NextResponse.json({
    success: true,
    message: `Inserted ${createMarksResult.count} students' marks.`,
    status: 200
  })
}

export const POST = verifySignatureAppRouter(handler);
