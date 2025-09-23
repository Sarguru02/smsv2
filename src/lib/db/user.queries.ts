import { prisma } from "./prisma";

async function createUser(username: string, password: string, role: 'STUDENT' | 'TEACHER') {
  return prisma.user.create({
    data: {
      username,
      password,
      role,
      createdAt: new Date(), 
      updatedAt: new Date()
    }, 
    select: {
      id: true, 
      username: true, 
      role: true,
      createdAt: true,
    }
  });
}

async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username }
  });
}

async function getUserById (id: number) {
  return prisma.user.findUnique({
    where: { id }
  });
}

export const UserQueries = {
  createUser,
  getUserByUsername,
  getUserById,
}
