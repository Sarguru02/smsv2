import { getDownloadUrl } from "@vercel/blob";
import { parse } from "csv-parse";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import type { ReadableStream as NodeReadableStream } from "stream/web";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { qstash } from "@/lib/qstash";
import { Env } from "@/lib/EnvVars";
import { csvProcessSchema, MarkInput, MarkInputSchema, Row } from "@/lib/types";
import { AppError, BadRequestError } from "@/lib/errors";
import { JobQueries } from "@/lib/db/job.queries";


async function readableFromWebStream(stream: NodeReadableStream) {
  return Readable.fromWeb(stream);
}

function validateHeaders(row: Record<string, string>) {
  const requiredKeys = ["ROLL NO", "EXAM"] as const;

  for (const key of requiredKeys) {
    if (!(key in row)) {
      throw new BadRequestError(`Missing required column: ${key}`);
    }
  }

  // Ensure there is at least one subject mark
  const { "ROLL NO": _, "EXAM": __, ...subjects } = row;
  if (Object.keys(subjects).length === 0) {
    throw new BadRequestError("At least one subject mark is required");
  }
}

function toMarkInput(raw: Record<string, string>): MarkInput {
  const { "ROLL NO": rollNo, "EXAM": examName, ...subjects } = raw;

  const obj = {
    rollNo,
    examName,
    marks: subjects
  };

  return MarkInputSchema.parse(obj);
}

async function processCsv(
  blobUrl: string,
  onChunk: (rows: MarkInput[]) => Promise<void>,
  chunkSize = 150
) {
  const signedUrl = getDownloadUrl(blobUrl);
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

  let buffer: MarkInput[] = [];

  for await (const rawRow of stream as AsyncIterable<Row>) {
    if (!validated) {
      validateHeaders(rawRow);
      validated = true;
    }

    const row = toMarkInput(rawRow);
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
  try {
    const body = await req.json();
    const { fileUrl, jobId } = csvProcessSchema.parse(body);
    const totalRows = await processCsv(fileUrl, async (rows) => {
      await qstash.publishJSON({
        url: `${Env.apiHost}/api/batch/marks/`,
        body: {
          jobId,
          markRows: rows
        }
      });
    })

    await JobQueries.updateTotalRows(jobId, totalRows);

    return NextResponse.json({
      message: "Processed the csv file, now creating students"
    })
  } catch (err) {
    console.error("Error occurred", err);
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

export const POST = verifySignatureAppRouter(handler);
