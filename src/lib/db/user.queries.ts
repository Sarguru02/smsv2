import { UserRole } from "../types";
import { prisma } from "./prisma";


type User = {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

async function createUser(username: string, hashedPassword: string, role: UserRole): Promise<User | null> {
  return prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      username,
      password: hashedPassword,
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

async function createManyUsers(users: { username: string, hashedPassword: string, role: UserRole }[]) {
  return prisma.user.createMany({
    data: users.map(u => ({
      id: crypto.randomUUID(),
      username: u.username,
      password: u.hashedPassword,
      role: u.role,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    )
  })
}


async function getUserByUsername(username: string) {
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

async function getUsersByRole(role: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [teachers, total] = await Promise.all([
    prisma.user.findMany({
      where: { role },
      orderBy: { username: "asc" },
      skip,
      take: limit
    }),
    prisma.user.count({ where: { role } })
  ])
  return {
    teachers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

async function getUserById(id: string): Promise<User | null> {
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

async function deleteManyUsersByUsername(usernames: string[]) {
  return prisma.user.deleteMany({
    where: {
      username: {
        in: usernames,
      }
    }
  })
}

async function updateUser(oldUsername: string, newUsername: string) {
  return prisma.user.update({
    where: {
      username: oldUsername
    },
    data: {
      username: newUsername,
      updatedAt: new Date()
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

async function deleteManyUsersById(ids: string[]) {
  return prisma.user.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
}

export const UserQueries = {
  createUser,
  createManyUsers,
  getUserByUsername,
  getUserById,
  getUsersByRole,
  updateUser,
  deleteManyUsersByUsername,
  deleteManyUsersById
}
