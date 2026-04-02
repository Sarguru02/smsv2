import { withAuth } from "@/lib/auth";
import { MarksQueries } from "@/lib/db/marks.queries";
import { NextResponse } from "next/server";

type StudentMarksContext = {
  params: Promise<{ rollNo: string }>
}

export const GET = withAuth<StudentMarksContext>(['STUDENT', 'TEACHER'], async (_req, _, context) => {
  if (!context) {
    throw new Error("Context is missing");
  }
  const { rollNo } = await context.params;
  const marks = await MarksQueries.findMarksByStudent(rollNo);

  return NextResponse.json(marks);
})