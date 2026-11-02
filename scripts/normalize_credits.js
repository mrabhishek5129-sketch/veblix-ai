const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Normalize credits to 500 for existing accounts that had thousands added during testing
  await prisma.user.updateMany({
    where: { credits: { gt: 1000 } },
    data: { credits: 500 },
  });
  const users = await prisma.user.findMany({ select: { name: true, email: true, credits: true } });
  console.log("UPDATED_USERS:", users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
