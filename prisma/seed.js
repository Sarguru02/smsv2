const { PrismaClient } = require("../src/generated/prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prisma = new PrismaClient();
const Env = process.env;

async function main() {
  const seedUsers = [
    {
      username: Env.nodeEnv === "production" ? Env.seedAdminUser : "devAdmin",
      password: Env.nodeEnv === "production" ? Env.seedAdminPassword : "devAdminPass",
      role: "ADMIN",
    },
    {
      username: Env.nodeEnv === "production" ? Env.seedTeacherUser : "devTeacher",
      password: Env.nodeEnv === "production" ? Env.seedTeacherPassword : "devTeacherPass",
      role: "TEACHER",
    },
    {
      username: Env.nodeEnv === "production" ? Env.seedStudentUser : "devStudent",
      password: Env.nodeEnv === "production" ? Env.seedStudentPassword : "devStudentPass",
      role: "STUDENT",
    },
  ];

  for (const { username, password, role } of seedUsers) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { username } });

    if (!existing) {
      await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          username,
          password: hashedPassword,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Seed user '${username}' (${role}) created`);
    } else {
      console.log(`ℹ️ User '${username}' already exists, skipping seeding`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
