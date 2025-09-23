import { PrismaClient } from "@/generated/prisma/client";
import { Env } from "@/lib/EnvVars";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (Env.nodeEnv !== "production") globalForPrisma.prisma = prisma;
