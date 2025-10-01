import { MarkInput } from "../types";
import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma/client"

async function createMarks(rollNo: string, examName: string, marks: Record<string, number>) {
  return prisma.mark.create({
    data: {
      id: crypto.randomUUID(),
      studentId: rollNo,
      examName,
      marks,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function createManyMarks(markRows: MarkInput[]) {
  return prisma.mark.createMany({
    data: markRows.map(m => ({
      id: crypto.randomUUID(),
      studentId: m.rollNo,
      examName: m.examName,
      marks: m.marks,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  })
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

async function deleteMarksByStudentId(studentId: string) {
  return prisma.mark.deleteMany({
    where: { studentId },
  });
}

async function deleteMarksByStudentIds(studentIds: string[]) {
  return prisma.mark.deleteMany({
    where: { studentId: { in: studentIds } },
  });
}

async function findExamsByStudent(studentId: string) {
  return prisma.mark.findMany({
    where: { studentId },
    select: {
      id: true,
      examName: true,
      marks: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

async function findAllExams(
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
) {
  const offset = (page - 1) * limit;

  const where: Prisma.MarkWhereInput = searchTerm
    ? {
      OR: [
        {
          examName: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          studentId: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    }
    : {};

  const [exams, total] = await Promise.all([
    prisma.mark.findMany({
      where,
      select: {
        id: true,
        examName: true,
        studentId: true,
        marks: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.mark.count({ where }),
  ]);

  return {
    data: exams,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function findExamsByStudentPaginated(
  studentId: string,
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
) {
  const offset = (page - 1) * limit;

  const where: Prisma.MarkWhereInput = {
    studentId,
    ...(searchTerm
      ? {
        examName: {
          contains: searchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      }
      : {}),
  };

  const [exams, total] = await Promise.all([
    prisma.mark.findMany({
      where,
      select: {
        id: true,
        examName: true,
        studentId: true,
        marks: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.mark.count({ where }),
  ]);

  return {
    data: exams,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export const MarksQueries = {
  createMarks,
  createManyMarks,
  findMarksByStudent,
  findMarksByStudentAndExam,
  updateMarks,
  deleteMarksById,
  deleteMarksByStudentId,
  deleteMarksByStudentIds,
  findExamsByStudent,
  findAllExams,
  findExamsByStudentPaginated,
};
