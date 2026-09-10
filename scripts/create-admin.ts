import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@peboli.store';
  const password = process.argv[3];

  if (!password) {
    console.error('Usage: npx ts-node scripts/create-admin.ts <email> <password>');
    console.error('Set ADMIN_EMAIL env var to override default admin email.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  console.log(`Creating admin user: ${email}`);

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Peboli Admin',
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
