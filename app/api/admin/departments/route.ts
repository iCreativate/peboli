import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'departments';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (setting && setting.value) {
      return NextResponse.json({
        success: true,
        departments: setting.value as Array<{ name: string; slug: string }>,
      });
    }

    // Return default departments if not found
    return NextResponse.json({
      success: true,
      departments: [
        { name: 'Appliances', slug: 'appliances' },
        { name: 'Automotive & DIY', slug: 'automotive-diy' },
        { name: 'Baby & Toddler', slug: 'baby-toddler' },
        { name: 'Beauty', slug: 'beauty' },
        { name: 'Books & Courses', slug: 'books-courses' },
        { name: 'Camping & Outdoor', slug: 'camping-outdoor' },
        { name: 'Clothing & Shoes', slug: 'clothing-shoes' },
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Gaming & Media', slug: 'gaming-media' },
        { name: 'Garden, Pool & Patio', slug: 'garden-pool-patio' },
        { name: 'Groceries & Household', slug: 'groceries-household' },
        { name: 'Health & Personal Care', slug: 'health-personal-care' },
        { name: 'Homeware', slug: 'homeware' },
        { name: 'Liquor', slug: 'liquor' },
        { name: 'Office & Stationery', slug: 'office-stationery' },
        { name: 'Pets', slug: 'pets' },
        { name: 'Sport & Training', slug: 'sport-training' },
        { name: 'Toys', slug: 'toys' },
      ],
    });
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.email !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { departments } = await request.json();

    if (!Array.isArray(departments)) {
      return NextResponse.json(
        { error: 'Invalid departments data', success: false },
        { status: 400 }
      );
    }

    const jsonValue = JSON.parse(JSON.stringify(departments));

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: {
        value: jsonValue,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEY,
        value: jsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Departments saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving departments:', error);
    return NextResponse.json(
      { error: 'Failed to save departments', success: false },
      { status: 500 }
    );
  }
}

