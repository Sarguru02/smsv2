import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma";


async function findManyStudentsByClass(className: string, page: number = 1, limit: number = 10, searchTerm?: string) {
  const skip = (page - 1) * limit;
  const where: Prisma.StudentWhereInput = { class: className };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },   // search by name
      { rollNo: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } }, // if rollNo is string
    ];
  }
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { rollNo: "asc" },
      skip,
      take: limit,
    }),
    prisma.student.count({ where: { class: className } }),
  ]);

  return {
    students,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function findManyStudentsByClassAndSection(className: string, section: string, page: number = 1, limit: number = 10, searchTerm?: string) {
  const skip = (page - 1) * limit;
  const where: Prisma.StudentWhereInput = { class: className };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },   // search by name
      { rollNo: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } }, // if rollNo is string
    ];
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { rollNo: "asc" },
      skip,
      take: limit,
    }),
    prisma.student.count({ where: { class: className, section } }),
  ]);

  return {
    students,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function deleteManyStudentsByRollNo(rollNos: string[]) {
  return prisma.student.deleteMany({
    where: {
      rollNo: {
        in: rollNos,
      },
    },
  });
}

async function findStudentByRollNo(rollNo: string) {
  return prisma.student.findUnique({
    where: { rollNo }
  })
}

async function findManyStudents(page: number = 1, limit: number = 10, searchTerm?: string) {
  const skip = (page - 1) * limit;

  const where: Prisma.StudentWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },   // search by name
      { rollNo: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } }, // if rollNo is string
    ];
  }
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { rollNo: "asc" },
      skip,
      take: limit,
    }),
    prisma.student.count(),
  ]);

  return {
    students,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export const StudentQueries = {
  findStudentByRollNo,
  findManyStudents,
  findManyStudentsByClass,
  findManyStudentsByClassAndSection,
  deleteManyStudentsByRollNo,
}
