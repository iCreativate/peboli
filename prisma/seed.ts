import { PrismaClient, UserRole } from '@prisma/client';
import { calculateSellPrice, MARKUP_DEFAULT } from '../lib/pricing';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

/** SAMPLE Gauteng-local placeholders — not imported/dropship goods. */
const SAMPLE_PRODUCTS = [
  {
    name: 'SAMPLE — Soweto Craft Chutney 350ml',
    brand: 'Soweto Kitchen Co.',
    slug: 'sample-soweto-craft-chutney',
    description: 'Small-batch chutney from a Gauteng home kitchen. SAMPLE listing for Local Shelf setup — replace with your real stock.',
    cost: 45,
    category: 'food',
    stock: 12,
    origin: 'Local',
  },
  {
    name: 'SAMPLE — Pretoria Beeswax Candles (3-pack)',
    brand: 'Pretoria Hive',
    slug: 'sample-pretoria-beeswax-candles',
    description: 'Hand-poured beeswax candles from Pretoria East. SAMPLE — update cost and photos before selling.',
    cost: 120,
    category: 'home',
    stock: 8,
    origin: 'Local',
  },
  {
    name: 'SAMPLE — Midrand Organic Rooibos 200g',
    brand: 'Midrand Tea Traders',
    slug: 'sample-midrand-rooibos',
    description: 'Loose-leaf rooibos sourced in Gauteng. SAMPLE placeholder for honest local resale at 30–40% markup.',
    cost: 55,
    category: 'food',
    stock: 20,
    origin: 'Local',
  },
  {
    name: 'SAMPLE — Johannesburg Recycled Glass Vase',
    brand: 'Jozi Glass Studio',
    slug: 'sample-jozi-glass-vase',
    description: 'Upcycled glass vase made in Johannesburg. SAMPLE product — cost + markup pricing only.',
    cost: 180,
    category: 'home',
    stock: 5,
    origin: 'Local',
  },
  {
    name: 'SAMPLE — Centurion Leather Key Ring',
    brand: 'Centurion Leather Works',
    slug: 'sample-centurion-leather-keyring',
    description: 'Hand-stitched leather key ring from a Centurion artisan. SAMPLE for Peboli Local Shelf.',
    cost: 35,
    category: 'crafts',
    stock: 15,
    origin: 'Local',
  },
];

async function main() {
  console.log('Peboli Local Shelf seed — Gauteng sample catalogue');

  const categories = [
    { name: 'Food & Pantry', slug: 'food', icon: '🍯' },
    { name: 'Home & Living', slug: 'home', icon: '🏠' },
    { name: 'Local Crafts', slug: 'crafts', icon: '🎨' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    });
  }

  const collections = [
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Gauteng Local', slug: 'gauteng-local' },
    { name: 'Summer', slug: 'summer' },
    { name: 'Deals & Promotions', slug: 'deals' },
    { name: 'Local Makers', slug: 'brands' },
    { name: 'PeboliSPLASH', slug: 'splash' },
    { name: 'Clearance', slug: 'clearance' },
  ];

  for (const col of collections) {
    await (prisma as any).collection.upsert({
      where: { slug: col.slug },
      update: { name: col.name },
      create: {
        name: col.name,
        slug: col.slug,
        description: `Peboli Local Shelf — ${col.name}`,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@peboli.store';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Peboli Local Shelf Admin',
        role: 'ADMIN',
        password: adminPassword ? await hashPassword(adminPassword) : null,
      },
    });
    console.log(`Created admin ${adminEmail} — set password via: npx ts-node scripts/create-admin.ts`);
  }

  let vendor = await prisma.vendor.findFirst({ where: { email: adminEmail } });
  if (!vendor) {
    const vendorUser = await prisma.user.upsert({
      where: { email: 'local-shelf@peboli.store' },
      update: {},
      create: {
        email: 'local-shelf@peboli.store',
        name: 'Peboli Local Shelf',
        role: UserRole.VENDOR,
      },
    });

    vendor = await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        name: 'Peboli Local Shelf — Gauteng',
        email: 'local-shelf@peboli.store',
        isVerified: true,
        verificationTier: 'ELITE',
        status: 'APPROVED',
        rating: 5,
        reviewCount: 0,
        positiveRating: 100,
      },
    });
  }

  const gautengCollection = await (prisma as any).collection.findUnique({ where: { slug: 'gauteng-local' } });

  for (const sample of SAMPLE_PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: sample.category } });
    if (!category) continue;

    const markupPercent = MARKUP_DEFAULT;
    const sellPrice = calculateSellPrice(sample.cost, markupPercent);
    const sku = `SAMPLE-${sample.slug.toUpperCase().slice(0, 12)}`;

    const existing = await prisma.product.findUnique({ where: { slug: sample.slug } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          cost: sample.cost,
          markupPercent,
          price: sellPrice,
          stock: sample.stock,
          isSample: true,
          status: 'ACTIVE',
        },
      });
      continue;
    }

    const product = await prisma.product.create({
      data: {
        name: sample.name,
        slug: sample.slug,
        brand: sample.brand,
        description: sample.description,
        cost: sample.cost,
        landedCost: sample.cost,
        markupPercent,
        price: sellPrice,
        compareAtPrice: null,
        savings: 0,
        savingsPercentage: 0,
        categoryId: category.id,
        condition: 'NEW',
        status: 'ACTIVE',
        stock: sample.stock,
        origin: sample.origin,
        sku,
        vendorId: vendor.id,
        isSample: true,
        images: {
          create: [{ url: '/products/placeholder.svg' }],
        },
      } as any,
    });

    if (gautengCollection) {
      await (prisma as any).collection.update({
        where: { id: gautengCollection.id },
        data: { products: { connect: { id: product.id } } },
      });
    }
  }

  await prisma.setting.upsert({
    where: { key: 'local_shelf' },
    update: {
      value: {
        mode: 'local-shelf',
        defaultMarkupPercent: MARKUP_DEFAULT,
        liquorEnabled: false,
        importProductEnabled: false,
      },
    },
    create: {
      key: 'local_shelf',
      value: {
        mode: 'local-shelf',
        defaultMarkupPercent: MARKUP_DEFAULT,
        liquorEnabled: false,
        importProductEnabled: false,
      },
    },
  });

  console.log('Seed complete — SAMPLE Gauteng products ready. Replace samples with real stock in admin.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
