import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Keys on prisma:', Object.keys(prisma));
  try {
    // @ts-ignore
    if (prisma.collection) {
        console.log('prisma.collection exists');
        // @ts-ignore
        const collections = await prisma.collection.findMany();
        console.log('Collections:', collections);
    } else {
        console.log('prisma.collection does NOT exist');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
