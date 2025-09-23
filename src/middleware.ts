import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Env } from '@/lib/EnvVars';

interface TokenPayload {
  userId: number;
  role: 'STUDENT' | 'TEACHER';
  studentId?: number;
  teacherId?: number;
}

function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, Env.jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-user-role', payload.role);
    if (payload.studentId) requestHeaders.set('x-student-id', payload.studentId.toString());
    if (payload.teacherId) requestHeaders.set('x-teacher-id', payload.teacherId.toString());

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};