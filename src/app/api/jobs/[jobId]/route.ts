import { NextRequest, NextResponse } from "next/server";

async function helloblabla(){
  console.log("hello world");
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  helloblabla();
  console.log(body);
  return NextResponse.json({message: "hello world!"})
}
