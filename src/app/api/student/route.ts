import { AuthService, withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { StudentQueries } from "@/lib/db/student.queries";
import { z } from "zod";
import { StudentInputSchema } from "@/lib/types";
import { UserQueries } from "@/lib/db/user.queries";
import { InternalError } from "@/lib/errors";

const deleteStudentSchema = z.object({
  ids: z.string().array()
})

export const GET = withAuth(['TEACHER'], async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const result = await StudentQueries.findManyStudents(page, limit);

  return NextResponse.json(result);
})

export const DELETE = withAuth(['TEACHER'], async (req) => {
  const body = await req.json();
  const { ids } = deleteStudentSchema.parse(body);
  const result = await StudentQueries.deleteManyStudentsById(ids);
  return NextResponse.json({
    success: true,
    deletedCount: result.count,
    message: `Successfully deleted ${result.count} students`
  });
})

export const POST = withAuth(["TEACHER"], async (req) =>{
  const body = await req.json();
  const {name, rollNo, className, section} = StudentInputSchema.parse(body);

  const createStudentResult = await StudentQueries.createStudent(name, rollNo, className, section);

  const createUserResult = await AuthService.createUser(rollNo, rollNo, 'STUDENT');

  if(!createUserResult){
    throw new InternalError("User not created.", {username: name, password: rollNo});
  }

  return NextResponse.json({
    success: true,
    message: `Inserted ${createStudentResult.name} into db. Username: ${createUserResult.username}`
  })
})
