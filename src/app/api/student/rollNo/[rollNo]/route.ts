import { withAuth } from "@/lib/auth";
import { StudentQueries } from "@/lib/db/student.queries";
import { NextResponse } from "next/server";

type StudentRollContext = {
  params: Promise<{ rollNo: string }>
}

export const GET = withAuth<StudentRollContext>(['STUDENT', 'TEACHER'], async (_req, _, context) => {
  if (!context) {
    throw new Error("Context is missing");
  }
  const { rollNo } = await context.params;
  const result = await StudentQueries.findStudentByRollNo(rollNo);

  return NextResponse.json(result);
})
