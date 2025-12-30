import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Helper to generate a 6-digit code
function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { identifier, type } = await req.json();

    if (!identifier || !type) {
      return NextResponse.json({ error: 'Missing identifier or type' }, { status: 400 });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB (upsert to replace existing)
    // Note: Prisma doesn't support upsert on non-unique fields easily if not @id, 
    // but we have @@unique([identifier, token]).
    // Actually, we want to replace ANY existing token for this identifier, or add a new one.
    // So we should delete old ones first.
    
    await prisma.verificationToken.deleteMany({
      where: { identifier }
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token: code,
        expires
      }
    });

    // Send the code
    if (type === 'email') {
      console.log(`[Real Verification] Sending Email to ${identifier}: Your code is ${code}`);
      // TODO: Integrate nodemailer here
      // await sendEmail(identifier, code);
    } else if (type === 'phone') {
      console.log(`[Real Verification] Sending SMS to ${identifier}: Your code is ${code}`);
      // TODO: Integrate Twilio here
      // await sendSMS(identifier, code);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Verification Send Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
