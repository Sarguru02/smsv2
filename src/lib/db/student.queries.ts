import { prisma } from "./prisma";

async function createStudent(name: string) {
  return prisma.student.create({
    data: {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function getStudentById(id: string) {
  return prisma.student.findUnique({ where: { id } });
}

async function listStudents() {
  return prisma.student.findMany();
}

export const StudentQueries = {
  createStudent, 
  getStudentById,
  listStudents
}
