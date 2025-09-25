import { withAuth } from "@/lib/auth";
import { MarksQueries } from "@/lib/db/marks.queries";
import { MarkInputSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export const POST = withAuth(["TEACHER"], async (req) => {
  const body = await req.json();
  const { examName, marks, rollNo } = MarkInputSchema.parse(body);

  const markResult = await MarksQueries.createMarks(rollNo, examName, marks);

  return NextResponse.json({
    message: "Success",
    res: markResult
  })
})
