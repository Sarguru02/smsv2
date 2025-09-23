import { prisma } from "./prisma";

async function createMarks(studentId: string, examName: string, marks: Record<string, number>) {
  return prisma.mark.create({
    data: {
      id: crypto.randomUUID(),
      studentId,
      examName,
      marks,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function findMarksByStudent(studentId: string) {
  return prisma.mark.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
}

async function findMarksByStudentAndExam(studentId: string, examName: string) {
  return prisma.mark.findFirst({
    where: { studentId, examName },
  });
}

async function updateMarks(
  id: string,
  data: { examName?: string; marks?: Record<string, number> }
) {
  return prisma.mark.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

async function deleteMarksById(id: string) {
  return prisma.mark.delete({
    where: { id },
  });
}

export const MarksQueries = {
  createMarks,
  findMarksByStudent,
  findMarksByStudentAndExam,
  updateMarks,
  deleteMarksById,
};
