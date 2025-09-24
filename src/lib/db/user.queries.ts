import { UserRole } from "../types";
import { prisma } from "./prisma";


export type User = {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

async function createUser(username: string, password: string, role: UserRole): Promise<User | null> {
  return prisma.user.create({
    data: {
      id: crypto.randomUUID(),
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
      createdAt: true
    }
  });
}

async function getUserByUsername(username: string){
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true, 
      username: true, 
      role: true,
      createdAt: true,
      password: true,
    }
  });
}

async function getUserById (id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, 
      username: true, 
      role: true,
      createdAt: true
    }
  });
}

export const UserQueries = {
  createUser,
  getUserByUsername,
  getUserById,
}
