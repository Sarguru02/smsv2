import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { StudentQueries } from "@/lib/db/student.queries";

type StudentRouteContext = {
  params: Promise<{className: string }>;
}

export const GET = withAuth<StudentRouteContext>(['TEACHER'], async (req, _, context ) => {
  if(!context){
    throw new Error("context is missing");
  }
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const { className } = await context.params;

  const result = await StudentQueries.findManyStudentsByClass(className, page, limit);
  
  return NextResponse.json(result);
})
