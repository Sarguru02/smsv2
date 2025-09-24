import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/lib/EnvVars';
import { jwtVerify } from "jose";
import { TokenPayloadSchema } from './lib/types';

const secret = new TextEncoder().encode(Env.jwtSecret);
// Routes that should bypass JWT auth
const PUBLIC_ROUTES = [
  /^\/api\/auth(\/.*)?$/,  // all auth routes
  /^\/api\/batch(\/.*)?$/, // all qstash worker routes
];

function isPublicRoute(path: string) {
  return PUBLIC_ROUTES.some((regex) => regex.test(path));
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    const parsed = TokenPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("Invalid JWT payload:", parsed.error);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const path = request.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }


    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-user-role', payload.role);

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
