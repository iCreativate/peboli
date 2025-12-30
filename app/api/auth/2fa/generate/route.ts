import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and Email required' }, { status: 400 });
    }

    // Generate secret
    const secret = authenticator.generateSecret();
    
    // Create otpauth URL
    const otpauth = authenticator.keyuri(email, 'Peboli', secret);

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    // Save secret to user (but don't enable it yet)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret },
      });
    } catch (dbError) {
      console.warn('DB update failed (mock mode likely):', dbError);
      // In mock mode, we can't persist, so this flow breaks unless we simulate persistence
      // For now, we'll return the secret to the client to send back for verification (ONLY FOR MOCK/DEV)
      return NextResponse.json({ 
        secret, 
        qrCodeUrl,
        warning: 'Running in mock mode - secret not saved to DB' 
      });
    }

    return NextResponse.json({ secret, qrCodeUrl });
  } catch (error) {
    console.error('2FA Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
