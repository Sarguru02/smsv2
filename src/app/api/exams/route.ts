import { withAuth } from "@/lib/auth";
import { MarksQueries } from "@/lib/db/marks.queries";
import { NextResponse } from "next/server";

export const GET = withAuth(['STUDENT', 'TEACHER'], async (req, user) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const searchTerm = url.searchParams.get('search') || '';
  const className = url.searchParams.get('class');
  const section = url.searchParams.get('section');

  try {
    let result;
    if (!className || !section) throw new Error("No class or section found")

    if (user?.role === 'STUDENT') {
      // For students, get their rollNo from the user record
      // Assuming user.username is the rollNo for students
      result = await MarksQueries.findExamsByStudentPaginated(user.username, page, limit, searchTerm);
    } else {
      // For teachers and admins, get all exams for the selected class.
      result = await MarksQueries.findExamsByClassAndSection(className, section, page, limit);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams", message: error },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(['TEACHER'], async (req, user) => {
  try {
    return NextResponse.json("success");
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete exams", message: error },
      { status: 500 }
    )
  }
});
