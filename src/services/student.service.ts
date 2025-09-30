import { AuthService } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function createStudentWithUser(
  name: string,
  rollNo: string,
  className: string,
  section: string
) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: {
        id: crypto.randomUUID(),
        name,
        rollNo,
        class: className,
        section,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    const hashedPassword = await AuthService.hashPassword(rollNo);

    const user = await tx.user.create({
      data: {
        id: crypto.randomUUID(),
        username: rollNo,
        password: hashedPassword,
        role: "STUDENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return { student, user };
  });
}

export async function deleteStudentWithUser(rollNos: string[]) {
  return prisma.$transaction(async (tx) => {
    const studentDelete = await tx.student.deleteMany({
      where: { rollNo: { in: rollNos } }
    });

    const userDelete = await tx.user.deleteMany({
      where: { username: { in: rollNos } }
    });

    return { studentDelete, userDelete };
  });
}

export async function updateStudentWithUser(
  id: string,
  updates: { rollNo?: string; name?: string; className?: string; section?: string }
) {
  return prisma.$transaction(async (tx) => {
    const { className, ...studentData } = updates;

    const existingStudent = await tx.student.findUnique({
      where: { id },
      select: { rollNo: true }
    });

    if (!existingStudent) {
      throw new Error(`Student with id ${id} not found`);
    }

    const student = await tx.student.update({
      where: { id },
      data: { ...studentData, class: className }
    });

    let user = null;
    if (updates.rollNo && updates.rollNo !== existingStudent.rollNo) {
      const hashedPassword = await AuthService.hashPassword(updates.rollNo);
      user = await tx.user.update({
        where: { username: existingStudent.rollNo },
        data: {
          username: updates.rollNo,
          password: hashedPassword,
        }
      });
    }

    return { student, user };
  });
}
