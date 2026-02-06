import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 0. Clean up
    console.log('Cleaning up mock data...');
    try {
        await (prisma as any).productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.vendor.deleteMany();
        await prisma.user.deleteMany({ where: { role: UserRole.VENDOR } });
    } catch (e) {
        console.log('Cleanup failed (tables might be empty):', e);
    }

    // 1. Create Categories
    const categories: Array<{name: string, slug: string, icon: string}> = [];
    // Categories are now managed via Admin Console
    
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
            },
        });
    }

    // 2. Create Collections
    console.log('Seeding collections...');
    const collections = [
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Christmas', slug: 'christmas' },
        { name: 'Summer', slug: 'summer' },
        { name: 'Deals & Promotions', slug: 'deals' },
        { name: 'Festive Liquor', slug: 'liquor' },
        { name: 'Brands Store', slug: 'brands' },
        { name: 'PeboliSPLASH', slug: 'splash' },
        { name: 'Clearance', slug: 'clearance' },
    ];

    for (const col of collections) {
        await (prisma as any).collection.upsert({
            where: { slug: col.slug },
            update: {},
            create: {
                name: col.name,
                slug: col.slug,
                description: `Featured collection: ${col.name}`,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
