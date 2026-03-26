import { withAuth } from "@/lib/auth";
import { JobQueries } from "@/lib/db/job.queries";
import { NextResponse } from "next/server";
import z from "zod";

const jobStatusSchema = z.object({
  jobId: z.string().min(1)
})

export const POST = withAuth(["TEACHER"], async (req) => {
  const body = await req.json();
  const { jobId } = jobStatusSchema.parse(body);
  const job = JobQueries.getJobById(jobId);

  return NextResponse.json({
    job
  });
})
