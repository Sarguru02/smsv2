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
    // First delete all marks for these students
    const marksDelete = await tx.mark.deleteMany({
      where: { studentId: { in: rollNos } }
    });

    // Then delete the students
    const studentDelete = await tx.student.deleteMany({
      where: { rollNo: { in: rollNos } }
    });

    // Finally delete the user accounts
    const userDelete = await tx.user.deleteMany({
      where: { username: { in: rollNos } }
    });

    return { 
      marksDeleted: marksDelete.count,
      studentsDeleted: studentDelete.count,
      usersDeleted: userDelete.count
    };
  });
}

export async function deleteSingleStudentWithUser(rollNo: string) {
  return prisma.$transaction(async (tx) => {
    // First delete all marks for this student
    const marksDelete = await tx.mark.deleteMany({
      where: { studentId: rollNo }
    });

    // Then delete the student
    const studentDelete = await tx.student.delete({
      where: { rollNo }
    });

    // Finally delete the user account
    const userDelete = await tx.user.delete({
      where: { username: rollNo }
    });

    return { 
      marksDeleted: marksDelete.count,
      studentDeleted: studentDelete,
      userDeleted: userDelete
    };
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
