import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserQueries } from '@/lib/db/user.queries';
import { Env } from '@/lib/EnvVars';
import { NextRequest, NextResponse } from 'next/server';
import { AppError, ForbiddenError, UnauthorizedError } from './errors';
import { TokenPayload, UserRole } from './types';


export class AuthService {
  private static readonly JWT_SECRET = Env.jwtSecret;
  private static readonly SALT_ROUNDS = 12;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: TokenPayload): string {
    console.log(this.JWT_SECRET)
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static async createUser(username: string, password: string, role: UserRole) {
    const hashedPassword = await this.hashPassword(password);
    return UserQueries.createUser(username, hashedPassword, role);
  }

  static async createManyUsers(users: { username: string, password: string, role: UserRole }[]) {
    const pNewUsers = await Promise.all(users.map(async u => {
      const hashedPassword = await this.hashPassword(u.password);
      return {
        username: u.username,
        hashedPassword,
        role: u.role
      }
    }))

    return UserQueries.createManyUsers(pNewUsers);
  }

  static async authenticateUser(username: string, password: string) {
    const user = await UserQueries.getUserByUsername(username);

    if (!user || !(await this.verifyPassword(password, user.password))) {
      return null;
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role as UserRole,
    };

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token: this.generateToken(tokenPayload),
    };
  }

  static async getUserFromToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    return UserQueries.getUserById(payload.userId);
  }

}

// Auth Handler
export function withAuth<C extends { params?: Promise<unknown> } = object>(
  allowedRoles: UserRole[] = [],
  handler: (
    req: NextRequest,
    user?: { id: string; username: string; role: UserRole; createdAt: Date },
    context?: C
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: C) => {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Missing authorization header");
      }

      // giving access for every routes to admin
      allowedRoles.push('ADMIN');

      const token = authHeader.split(" ")[1];
      const user = await AuthService.getUserFromToken(token);

      if (!user) throw new UnauthorizedError("Token expired.");
      if (allowedRoles.length && !allowedRoles.includes(user.role as UserRole)) {
        throw new ForbiddenError("You do not have permission");
      }

      return handler(req, { ...user, role: user.role as UserRole }, context);
    } catch (err) {
      if (err instanceof AppError) {
        return NextResponse.json(
          { error: err.message, details: err.details },
          { status: err.statusCode }
        );
      }
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
