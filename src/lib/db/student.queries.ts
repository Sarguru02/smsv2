import { prisma } from "./prisma";


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

async function deleteManyStudentsByRollNo(rollNos: string[]) {
  return prisma.student.deleteMany({
    where: {
      rollNo: {
        in: rollNos,
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

async function findStudentByRollNo(rollNo: string){
  return prisma.student.findUnique({
    where: { rollNo }
  })
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
  findStudentByRollNo,
  findManyStudents,
  findManyStudentsByClass,
  findManyStudentsByClassAndSection,
  updateStudent,
  deleteManyStudentsByRollNo,
}
