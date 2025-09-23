import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserQueries, UserRole } from '@/lib/db/user.queries';
import { Env } from '@/lib/EnvVars';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  studentId?: number;
  teacherId?: number;
}

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
