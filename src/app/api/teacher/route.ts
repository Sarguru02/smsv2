import { AuthService, withAuth } from "@/lib/auth";
import { UserQueries } from "@/lib/db/user.queries";
import { InternalError } from "@/lib/errors";
import { UserRole } from "@/lib/types";
import { NextResponse } from "next/server";
import z from "zod";

const createTeacherSchema = z.object({
  username: z.string().min(5),
  password: z.string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must have at least one lowercase character")
    .regex(/[A-Z]/, "Password must have at least one uppercase character")
    .regex(/\d/, "Password must have at least one number"),
  role: z.custom<UserRole>()
})

const deleteTeacherSchema = z.object({
  ids: z.string().array()
})

const updateTeacherSchema = z.object({
  id: z.string(),
  username: z.string().min(5)
})

export const POST = withAuth([], async (req) => {
  const body = await req.json();
  const { username, password, role } = createTeacherSchema.parse(body);
  const user = await AuthService.createUser(username, password, role);

  if (!user) {
    throw new InternalError("User not created.", { username, password });
  }

  return NextResponse.json({
    success: true,
    message: `Created teacher with id ${user.id}`,
    res: user
  })
})

export const GET = withAuth([], async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const result = await UserQueries.getUsersByRole("TEACHER", page, limit);

  return NextResponse.json(result);
})

export const PUT = withAuth([], async (req) => {
  const body = await req.json();
  const { id, username } = updateTeacherSchema.parse(body);

  const updatedTeacher = await UserQueries.updateUser(id, username);

  return NextResponse.json({
    success: true,
    res: updatedTeacher
  })
})

export const DELETE = withAuth([], async (req) => {
  const body = await req.json();
  const { ids } = deleteTeacherSchema.parse(body);
  const uresult = await UserQueries.deleteManyUsersById(ids);
  return NextResponse.json({
    success: true,
    deletedCount: uresult.count,
    message: `Successfully deleted ${uresult.count} Teachers`
  });
})

