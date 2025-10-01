import { withAuth } from "@/lib/auth";
import { StudentQueries } from "@/lib/db/student.queries";
import { NextResponse } from "next/server";
import { deleteSingleStudentWithUser } from "@/services/student.service";

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

export const DELETE = withAuth<StudentRollContext>(['TEACHER', 'ADMIN'], async (_req, _, context) => {
  if (!context) {
    throw new Error("Context is missing");
  }
  const { rollNo } = await context.params;
  
  try {
    const result = await deleteSingleStudentWithUser(rollNo);
    return NextResponse.json({
      success: true,
      message: `Successfully deleted student ${rollNo}, their user account, and ${result.marksDeleted} exam records`,
      details: {
        studentDeleted: result.studentDeleted,
        userDeleted: result.userDeleted,
        marksDeleted: result.marksDeleted
      }
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student and related data" },
      { status: 500 }
    );
  }
})
