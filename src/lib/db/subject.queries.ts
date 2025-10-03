import { Prisma } from "@/generated/prisma";
import { SubjectInput } from "../types";
import { prisma } from "./prisma";

async function createSubject({ name, className, section, maxMarks }: SubjectInput) {
  return prisma.subject.create({
    data: {
      id: crypto.randomUUID(),
      name,
      class: className,
      section,
      maxMarks,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
}

async function createManySubjects(subjects: SubjectInput[]) {
  const data = subjects.map(s => ({
    id: crypto.randomUUID(),
    name: s.name,
    class: s.className,
    section: s.section,
    maxMarks: s.maxMarks,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
  const res = await prisma.subject.createMany({
    data,
  })
  return { ids: data.map(d => d.id), count: res.count }
}

async function findManySubjects(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  className?: string,
  section?: string
) {
  const skip = (page - 1) * limit;

  // Build `where` dynamically
  const where: Prisma.SubjectWhereInput = {};

  if (className) {
    where.class = className;
  }

  if (section) {
    where.section = section;
  }

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
    ];
  }

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.subject.count({ where }),
  ]);

  return {
    subjects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function updateSubject(id: string, data: { className?: string, section?: string, maxMarks?: string }) {
  return prisma.subject.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    }
  })
}

async function deleteSubjectsById(ids: string[]) {
  return prisma.subject.deleteMany({
    where: { id: { in: ids } }
  })
}

export const SubjectQueries = {
  createSubject,
  createManySubjects,
  findManySubjects,
  updateSubject,
  deleteSubjectsById,
};
