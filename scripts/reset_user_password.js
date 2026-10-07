const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function resetPassword(email, newPlainPassword) {
  const hashedPassword = await bcrypt.hash(newPlainPassword, 10);
  const updated = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  console.log(`✅ Password successfully reset for ${updated.email}`);
}

const email = process.argv[2] || "mrabhishek5129@gmail.com";
const newPass = process.argv[3] || "123456";

resetPassword(email, newPass)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
