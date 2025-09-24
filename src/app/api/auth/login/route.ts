import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';
import { UserRole } from '@/lib/types';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.custom<UserRole>(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = loginSchema.parse(body);

    const result = await AuthService.authenticateUser(username, password);

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    const resRole = result.user.role as UserRole;

    if(resRole !== role){
      return NextResponse.json(
        { error: `Role<${role}> not allowed in this endpoint.` },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: result.user,
        token: result.token,
        message: 'Login successful'
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
