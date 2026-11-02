const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const action = process.argv[2] || 'list';
  const targetCredits = parseInt(process.argv[3], 10) || 100;

  if (action === 'set_all') {
    const updated = await prisma.user.updateMany({
      data: { credits: targetCredits },
    });
    console.log(`✅ Set all users' credits to ${targetCredits}. Total updated: ${updated.count}`);
  } else if (action === 'set_user') {
    const email = process.argv[3];
    const amount = parseInt(process.argv[4], 10) || 100;
    if (!email) {
      console.log('Provide user email: node manage_credits.js set_user <email> <amount>');
      return;
    }
    const updated = await prisma.user.update({
      where: { email },
      data: { credits: amount },
    });
    console.log(`✅ Updated ${updated.email} credits to: ${updated.credits}`);
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, credits: true, role: true },
  });
  console.log('CURRENT_DATABASE_USERS:');
  console.table(users);
}

main()
  .catch((err) => console.error('DB ERROR:', err))
  .finally(() => prisma.$disconnect());
