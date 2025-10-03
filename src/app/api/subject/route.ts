import { withAuth } from "@/lib/auth";
import { SubjectQueries } from "@/lib/db/subject.queries";
import { SubjectInputSchema } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSubjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  className: z.string().optional(),
  section: z.string().optional(),
  maxMarks: z.string()
    .trim()
    .regex(/^\d+$/, "Max Marks must be a number")
});


const deleteSubjectSchema = z.object({
  ids: z.string().array(),
})

export const POST = withAuth(["TEACHER"], async (req) => {
  const body = await req.json();
  const parsed = SubjectInputSchema.parse(body);


  const result = await SubjectQueries.createSubject(parsed);

  return NextResponse.json({
    success: true,
    message: `Inserted ${result.name} into db.`,
  })
})

export const GET = withAuth(['TEACHER'], async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const searchTerm = searchParams.get('searchTerm') as string | undefined;
  const className = searchParams.get('class') as string | undefined;
  const section = searchParams.get('section') as string | undefined;

  const result = await SubjectQueries.findManySubjects(page, limit, searchTerm, className, section);

  return NextResponse.json({
    subjects: result.subjects,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  })
})

export const PUT = withAuth(["TEACHER"], async (req) => {
  const body = await req.json();
  const { id, ...data } = updateSubjectSchema.parse(body);

  const updatedSubject = await SubjectQueries.updateSubject(id, data);

  return NextResponse.json({
    success: true,
    res: updatedSubject
  })
})

export const DELETE = withAuth(['TEACHER'], async (req) => {
  const body = await req.json();
  const { ids } = deleteSubjectSchema.parse(body);
  const result = await SubjectQueries.deleteSubjectsById(ids);
  return NextResponse.json({
    success: true,
    message: `Successfully deleted ${result.count} subjects.`,
    details: {
      subjectsDeleted: result.count
    }
  });
})
