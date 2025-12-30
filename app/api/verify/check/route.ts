import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { identifier, code } = await req.json();

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Missing identifier or code' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token: code,
      }
    });

    if (!record) {
      return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 400 });
    }

    if (new Date() > record.expires) {
      // Clean up expired
      await prisma.verificationToken.deleteMany({ where: { identifier } });
      return NextResponse.json({ success: false, error: 'Code expired' }, { status: 400 });
    }

    // Valid - Clean up
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    return NextResponse.json({ success: true, message: 'Verified successfully' });
  } catch (error) {
    console.error('Verification Check Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
