import { prisma } from "./prisma";

async function createStudent(rollNo: string, name: string, className: string, section: string){
  return prisma.student.create({
    data: {
      id: crypto.randomUUID(),
      rollNo,
      name,
      class: className,
      section,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
}

async function findManyStudentsByClass(className: string) {
  return prisma.student.findMany({
    where: { class: className },
    orderBy: { rollNo: "asc" }, // optional
  });
}

async function findManyStudentsByClassAndSection( className: string, section: string){
  return prisma.student.findMany({
    where: {
      class: className,
      section,
    },
    orderBy: { rollNo: "asc" },
  });
}

async function deleteStudentById(id: string) {
  return prisma.student.delete({
    where: { id },
  });
}

async function updateStudent( id: string, data: { rollNo?: string; name?: string; class?: string; section?: string; }) {
  return prisma.student.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

export const StudentQueries = {
  createStudent,
  findManyStudentsByClass,
  findManyStudentsByClassAndSection,
  deleteStudentById,
  updateStudent
}
