import { withAuth } from "@/lib/auth";
import { JobQueries } from "@/lib/db/job.queries";
import { qstash } from "@/lib/qstash";
import { NextResponse } from "next/server";
import { z } from "zod";

const ackUploadSchema = z.object({
  fileUrl: z.string().min(1),
  endpoint: z.url()
})
export const POST = withAuth(['TEACHER'], async (req) => {
  const body = await req.json();
  const { fileUrl, endpoint } = ackUploadSchema.parse(body);
  const jobId = crypto.randomUUID()
  const job = await JobQueries.createJob(jobId, fileUrl);

  await qstash.publishJSON({
    url: endpoint,
    body: {
      fileUrl,
      jobId,
    }
  })

  return NextResponse.json({
    message: "Processing CSV file",
    jobId,
    jobStatus: job.status
  })
})
