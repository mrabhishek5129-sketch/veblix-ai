const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      credits: 5000,
    },
  });
  console.log(`Successfully updated users. All accounts now have 5000 credits! Count: ${result.count}`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
