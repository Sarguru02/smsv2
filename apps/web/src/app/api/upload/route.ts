import { JobQueries } from '@/lib/db/job.queries';
import { qstash } from '@/lib/qstash';
import { BatchUploadType } from '@/lib/types';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";

const tokenPayloadSchema = z.object({
  jobId: z.string().min(1),
  processEndpoint: z.url(),
  type: z.custom<BatchUploadType>(),
  userId: z.string().min(1),
  fileName: z.string().min(1)
})

export const POST = async (req: NextRequest) => {

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (
        _pathname,
        clientPayload
      ) => {
        if (!clientPayload) {
          throw new Error("clientPayload is not present.");
        }

        return {
          allowedContentTypes: ['text/csv'],
          addRandomSuffix: false,
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
          if (!tokenPayload) {
            throw new Error("No tokenPayload is available");
          }
          const parsed = JSON.parse(tokenPayload);
          const { jobId, processEndpoint, fileName, type, userId } = tokenPayloadSchema.parse(parsed);
          await JobQueries.createJob(jobId, blob.url, userId, fileName, type);

          await qstash.publishJSON({
            url: processEndpoint,
            body: {
              fileUrl: blob.url,
              jobId
            },
            retries: 0
          })
        } catch (error) {
          console.error(error);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
