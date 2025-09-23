import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export interface TokenPayload {
  userId: number;
  role: 'STUDENT' | 'TEACHER';
  studentId?: number;
  teacherId?: number;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
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

  static async createUser(username: string, password: string, role: 'STUDENT' | 'TEACHER') {
    const hashedPassword = await this.hashPassword(password);
    
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async authenticateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (!user || !(await this.verifyPassword(password, user.password))) {
      return null;
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      studentId: user.student?.id,
      teacherId: user.teacher?.id,
    };

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        student: user.student,
        teacher: user.teacher,
      },
      token: this.generateToken(tokenPayload),
    };
  }

  static async getUserFromToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    return prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        student: true,
        teacher: true,
      },
    });
  }
}
