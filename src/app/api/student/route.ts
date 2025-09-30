import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { StudentQueries } from "@/lib/db/student.queries";
import { z } from "zod";
import { StudentInputSchema } from "@/lib/types";
import { createStudentWithUser, deleteStudentWithUser, updateStudentWithUser } from "@/services/student.service";

const updateStudentSchema = z.object({
  id: z.string(),
  rollNo: z.string().optional(),
  name: z.string().optional(),
  className: z.string().optional(),
  section: z.string().optional(),
});

const deleteStudentSchema = z.object({
  rollNos: z.string().array(),
})

export const GET = withAuth(['TEACHER'], async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const result = await StudentQueries.findManyStudents(page, limit);

  // Restructure to match component expectations
  return NextResponse.json({
    students: result.students,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  });
})

export const DELETE = withAuth(['TEACHER'], async (req) => {
  const body = await req.json();
  const { rollNos } = deleteStudentSchema.parse(body);
  const uresult = await deleteStudentWithUser(rollNos);
  return NextResponse.json({
    success: true,
    message: `Successfully deleted ${uresult.userDelete} students`
  });
})

export const POST = withAuth(["TEACHER"], async (req) => {
  const body = await req.json();
  const { name, rollNo, className, section } = StudentInputSchema.parse(body);


  const createStudentResult = await createStudentWithUser(name, rollNo, className, section);

  return NextResponse.json({
    success: true,
    message: `Inserted ${createStudentResult.student.name} into db. Username: ${createStudentResult.user.username}`,
  })
})

export const PUT = withAuth(["TEACHER"], async (req) => {
  const body = await req.json();
  const { id, className, ...data } = updateStudentSchema.parse(body);
  console.log("Student id: ", id);

  const updatedStudent = await updateStudentWithUser(id, { className, ...data });

  return NextResponse.json({
    success: true,
    res: updatedStudent
  })
})
