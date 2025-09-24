const { PrismaClient } = require('../src/generated/prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const Env = process.env;

async function main() {
  const username = Env.nodeEnv == "production" ? Env.seedUser: "devAdmin";
  const password = Env.nodeEnv == "production" ? Env.seedPassword : "devPassword";
  const role = "ADMIN";

  const hashedPassword = await bcrypt.hash(password, 10);

  // check if user already exists
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
    console.log(`✅ Seed user '${username}' created`);
  } else {
    console.log(`ℹ️ User '${username}' already exists, skipping seeding`);
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
