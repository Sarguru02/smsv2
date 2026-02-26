import { getDownloadUrl } from "@vercel/blob";
import { parse } from "csv-parse";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import type { ReadableStream as NodeReadableStream } from "stream/web";
import { qstash, qstashWrapper } from "@/lib/qstash";
import { Env } from "@/lib/EnvVars";
import { csvProcessSchema, Row, subjectCsvRequiredHeaders, SubjectInput, SubjectInputSchema } from "@/lib/types";
import { AppError, BadRequestError } from "@/lib/errors";
import { JobQueries } from "@/lib/db/job.queries";

async function readableFromWebStream(stream: NodeReadableStream) {
  return Readable.fromWeb(stream);
}

function validateHeaders(row: Record<string, string>) {
  for (const key of subjectCsvRequiredHeaders) {
    if (!(key in row)) {
      throw new BadRequestError(`Missing required column: ${key}`);
    }
  }
}

function toSubjectRow(raw: Record<string, string>): SubjectInput {
  return SubjectInputSchema.parse({
    name: raw["NAME"],
    className: raw["CLASS"],
    section: raw["SECTION"],
    maxMarks: raw["MAXIMUM MARKS"]
  });
}

async function processCsv(
  blobUrl: string,
  onChunk: (rows: Row[]) => Promise<void>,
  chunkSize = 150
) {
  const signedUrl = getDownloadUrl(blobUrl);
  console.log("url to fetch brother:", signedUrl);
  let validated = false;
  let rowCount = 0;

  const res = await fetch(signedUrl);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch CSV: ${res.status}`);
  }

  const parser = parse({
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
  });

  const stream = (await readableFromWebStream(
    res.body as unknown as NodeReadableStream
  )).pipe(parser);

  let buffer: SubjectInput[] = [];

  for await (const rawRow of stream as AsyncIterable<Row>) {
    if (!validated) {
      validateHeaders(rawRow);
      validated = true;
    }

    const row = toSubjectRow(rawRow);
    buffer.push(row);

    rowCount++;

    if (buffer.length >= chunkSize) {
      await onChunk(buffer);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    await onChunk(buffer);
  }

  return rowCount;
}

async function handler(req: NextRequest) {
  let jobId: string | undefined;

  try {
    const body = await req.json();
    const { fileUrl, jobId: parsedJobId } = csvProcessSchema.parse(body);
    jobId = parsedJobId;

    const totalRows = await processCsv(fileUrl, async (rows) => {
      await qstash.publishJSON({
        url: `${Env.apiHost}/api/batch/subject/`,
        body: {
          jobId,
          subjects: rows,
        },
        retries: 0
      });
    })

    await JobQueries.updateTotalRows(jobId, totalRows);

    return NextResponse.json({
      message: "Processed the csv file, now creating subjects"
    })
  } catch (err) {
    console.error("Error occurred in subject CSV processing:", err);

    if (jobId) {
      const errorDetails = {
        message: err instanceof Error ? err.message : "Unknown error occurred during subject CSV processing",
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        context: "subject_csv_processing"
      };
      await JobQueries.updateStatusWithError(jobId, "failed", errorDetails);
    }

    if (err instanceof AppError) {
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status: err.statusCode }
      )
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = qstashWrapper(handler);
