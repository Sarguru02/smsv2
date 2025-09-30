import { AuthService } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { StudentInput } from "@/lib/types";

export async function createManyStudentsWithUsers(students: StudentInput[]) {
  return prisma.$transaction(async (tx) => {
    const studentsResult = await tx.student.createMany({
      data: students.map(s => ({
        id: crypto.randomUUID(),
        rollNo: s.rollNo,
        name: s.name,
        class: s.className,
        section: s.section,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    });

    const usersInput = await Promise.all(
      students.map(async s => ({
        id: crypto.randomUUID(),
        username: s.rollNo,
        password: await AuthService.hashPassword(s.rollNo),
        role: "STUDENT",
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    const usersResult = await tx.user.createMany({
      data: usersInput
    });

    return {
      studentsInserted: studentsResult.count,
      usersInserted: usersResult.count
    };
  });
}
