import { prisma } from "./prisma";

async function createTeacher(name: string) {
  return prisma.teacher.create({
    data: {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function getTeacherById(id: string) {
  return prisma.teacher.findUnique({ where: { id } });
}

async function listTeachers() {
  return prisma.teacher.findMany();
}

export const TeacherQueries = {
  createTeacher,
  getTeacherById,
  listTeachers
}
