import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  try {
    // Cast prisma to any to avoid type errors if client generation is lagging
    const messages = await (prisma as any).productChat.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, message } = body;
    const userId = (session.user as any).id;

    if (!productId || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Removed purchase verification to allow pre-purchase questions
    
    const chat = await (prisma as any).productChat.create({
      data: {
        productId,
        userId,
        message,
      },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      }
    });

    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
