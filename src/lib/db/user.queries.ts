import { prisma } from "./prisma";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

async function createUser(username: string, password: string, role: UserRole) {
  return prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      username,
      password,
      role,
      createdAt: new Date(), 
      updatedAt: new Date()
    }
  });
}

async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username }
  });
}

async function getUserById (id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}

export const UserQueries = {
  createUser,
  getUserByUsername,
  getUserById,
}
