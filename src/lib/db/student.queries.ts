import { StudentInput } from "../types";
import { prisma } from "./prisma";

async function createStudent(rollNo: string, name: string, className: string, section: string, createdAt?: Date, updatedAt?: Date) {
  return prisma.student.create({
    data: {
      id: crypto.randomUUID(),
      rollNo,
      name,
      class: className,
      section,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date()
    }
  })
}

async function createManyStudents(students: StudentInput[]){
  return prisma.student.createMany({
    data: students.map(s => ({
      id: crypto.randomUUID(),
      rollNo: s.rollNo,
      name: s.name, 
      class: s.className, 
      section: s.section,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  })
}

async function findManyStudentsByClass(className: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: { class: className },
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

async function findManyStudentsByClassAndSection(className: string, section: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: {
        class: className,
        section,
      },
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

async function deleteManyStudentsById(ids: string[]) {
  return prisma.student.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}

async function updateStudent(id: string, data: { rollNo?: string; name?: string; class?: string; section?: string; }) {
  return prisma.student.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

async function findManyStudents(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  
  const [students, total] = await Promise.all([
    prisma.student.findMany({
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
  createStudent,
  createManyStudents,
  findManyStudents,
  findManyStudentsByClass,
  findManyStudentsByClassAndSection,
  updateStudent,
  deleteManyStudentsById,
}
