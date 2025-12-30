import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // In a real app, get from session
    const vendor = await prisma.vendor.findFirst();
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: vendor.id,
      name: vendor.name,
      walletBalance: (vendor as any).walletBalance,
      // Add other fields as needed
    });
  } catch (error) {
    console.error('Failed to fetch vendor profile', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
