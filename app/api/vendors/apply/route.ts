import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      name, 
      email, 
      phone, 
      businessType, 
      idDocument, 
      proofOfAddress, 
      businessDocuments,
      isPhoneVerified,
      isEmailVerified
    } = body;

    // Validate required fields
    if (!userId || !name || !email || !idDocument || !proofOfAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (businessType === 'BUSINESS' && !businessDocuments) {
      return NextResponse.json({ error: 'Business documents are required' }, { status: 400 });
    }

    // Check if vendor already exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      return NextResponse.json({ error: 'You have already applied' }, { status: 400 });
    }

    // Determine enum value for businessType (ensure it matches)
    const type = businessType === 'BUSINESS' ? 'BUSINESS' : 'INDIVIDUAL';

    let vendor;
    try {
      vendor = await prisma.vendor.create({
        data: {
          userId,
          name,
          email,
          phone,
          // @ts-ignore: Types might be stale
          businessType: type,
          idDocument,
          proofOfAddress,
          businessDocuments,
          isPhoneVerified: Boolean(isPhoneVerified),
          isEmailVerified: Boolean(isEmailVerified),
          // @ts-ignore: Types might be stale
          status: 'PENDING',
          verificationTier: 'BASIC',
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error occurred while creating vendor.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, vendor });
  } catch (error) {
    console.error('Vendor application error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
