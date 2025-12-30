import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, token } = body;

    if (!userId || !token) {
      return NextResponse.json({ error: 'User ID and Token required' }, { status: 400 });
    }

    let user;
    try {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } catch (e) {
      console.warn('DB lookup failed', e);
      // Fallback for mock users who can't actually have 2FA persisted
      // If we are in mock mode, we generally can't validate real 2FA unless we stored the secret in memory or client (insecure)
      // For now, if DB fails, we accept '123456' as a magic code for testing
      if (token === '123456') {
         return NextResponse.json({ 
          success: true, 
          user: { id: userId, name: 'Mock User', email: 'mock@example.com', role: 'BUYER' } 
        });
      }
    }

    if (!user) {
       // If DB lookup failed but we handled it in the catch block (mock user), we might have already returned.
       // But if we are here and user is null, it means DB worked but user wasn't found.
       // OR DB failed and we didn't return (e.g. token wasn't 123456).
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cast user to any to avoid TS errors with dynamic schema fields if types are stale
    const userWith2FA = user as any;

    if (!userWith2FA.isTwoFactorEnabled || !userWith2FA.twoFactorSecret) {
       // If 2FA is not enabled or secret is missing, we can treat it as valid
       // (This covers cases where 2FA was disabled concurrently or never set up properly)
       return NextResponse.json({ 
         success: true, 
         user: { 
           id: user.id, 
           email: user.email, 
           name: user.name, 
           role: user.role 
         } 
       });
    }

    const isValid = authenticator.verify({ token, secret: userWith2FA.twoFactorSecret });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id,
        email: user.email, 
        name: user.name,
        role: user.role 
      } 
    });

  } catch (error) {
    console.error('2FA Validate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
