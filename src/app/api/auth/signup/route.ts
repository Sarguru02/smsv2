import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'TEACHER']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = signupSchema.parse(body);

    const user = await AuthService.createUser(username, password, role);

    return NextResponse.json(
      { user, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'User with this username already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}