import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = withAuth(['TEACHER'], async (req) => {
  const body = await req.json();
  return NextResponse.json(body);
})
