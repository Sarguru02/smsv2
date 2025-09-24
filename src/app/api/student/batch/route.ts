import { AuthService, withAuth } from "@/lib/auth";
import { StudentQueries } from "@/lib/db/student.queries";
import { StudentInputSchema, UserRole } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const studentBatchUploadSchema = z.array(StudentInputSchema);

export const POST = withAuth(['TEACHER'], async (req)=> {
  const body = await req.json();
  const students = studentBatchUploadSchema.parse(body);

  const createStudentsResult = await StudentQueries.createManyStudents(students);

  const createUsersInput = students.map(s => ({
    username: s.rollNo,
    password: s.rollNo,
    role: "STUDENT" as UserRole
  }))
  const createUsersResult = await AuthService.createManyUsers(createUsersInput);


  return NextResponse.json({
    success: true, 
    message: `Inserted ${createStudentsResult.count} students, and ${createUsersResult.count} users.`,
    status: 200
  })
})
