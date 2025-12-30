import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking models...');
  // @ts-ignore
  if (prisma.walletTransaction) console.log('walletTransaction exists');
  else console.log('walletTransaction MISSING');

  // @ts-ignore
  if (prisma.notification) console.log('notification exists');
  else console.log('notification MISSING');

  // @ts-ignore
  if (prisma.vendor) {
      console.log('vendor exists');
      // Check if we can query pendingBalance - strictly speaking we can't check schema at runtime easily without a query, 
      // but if the model exists in schema.prisma and we generated client, it should be fine.
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
