import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { amount, paymentMethod } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // In a real app, get from session
    const vendor = await prisma.vendor.findFirst();
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Update wallet balance
    const updatedVendor = await (prisma as any).vendor.update({
      where: { id: vendor.id },
      data: {
        walletBalance: {
          increment: amount
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      walletBalance: updatedVendor.walletBalance 
    });
  } catch (error) {
    console.error('Failed to top up wallet', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
