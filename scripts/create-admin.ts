import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npx ts-node scripts/create-admin.ts <email> <password>');
    process.exit(1);
  }

  console.log(`Creating admin user: ${email}`);

  const hashedPassword = hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created/updated successfully: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
