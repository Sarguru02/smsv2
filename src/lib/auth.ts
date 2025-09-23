import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TeacherQueries} from '@/lib/db/teacher.queries';
import { StudentQueries } from '@/lib/db/student.queries';
import { UserQueries } from '@/lib/db/user.queries';

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

    switch (role){
      case 'TEACHER': 
        await TeacherQueries.createTeacher(username);
        break;
      case 'STUDENT':
        await StudentQueries.createStudent(username);
        break;
    }

    return UserQueries.createUser(username, hashedPassword, role);
  }

  static async authenticateUser(username: string, password: string) {
    const user = await UserQueries.getUserByUsername(username);

    if (!user || !(await this.verifyPassword(password, user.password))) {
      return null;
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
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
