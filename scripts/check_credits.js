const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      credits: true,
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      projects: {
        select: { id: true, title: true, description: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  console.log("USERS_AND_PROJECTS:", JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
