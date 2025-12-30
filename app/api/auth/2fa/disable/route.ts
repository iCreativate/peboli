import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await prisma.user.update({
      where: { id: userId },
      data: { 
        isTwoFactorEnabled: false,
        twoFactorSecret: null 
      } as any,
    });

    return NextResponse.json({ success: true, message: '2FA Disabled' });
  } catch (error) {
    console.error('2FA Disable error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
