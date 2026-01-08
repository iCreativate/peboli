import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'banking_settings';

async function loadBankingSettings() {
  try {
    // Check if Setting model exists in Prisma client
    if (!prisma.setting) {
      console.error('Setting model not found in Prisma client');
      throw new Error('Setting model not available');
    }
    
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (setting && setting.value) {
      return setting.value as {
        defaultCurrency: string;
        autoReconcile: boolean;
        notifyDeposits: boolean;
        notifyWithdrawals: boolean;
        notifyFailures: boolean;
      };
    }
  } catch (error: any) {
    console.error('Error loading banking settings:', error);
    // If it's a model not found error, return defaults
    if (error?.message?.includes('Setting model not available') || error?.code === 'P2001') {
      console.warn('Setting model not available, returning defaults');
    }
  }
  
  // Return default settings
  return {
    defaultCurrency: 'ZAR',
    autoReconcile: false,
    notifyDeposits: true,
    notifyWithdrawals: true,
    notifyFailures: true,
  };
}

async function saveBankingSettings(settings: {
  defaultCurrency: string;
  autoReconcile: boolean;
  notifyDeposits: boolean;
  notifyWithdrawals: boolean;
  notifyFailures: boolean;
}) {
  try {
    // Check if Setting model exists in Prisma client
    if (!prisma.setting) {
      console.error('Setting model not found in Prisma client');
      throw new Error('Setting model not available. Please ensure Prisma client is regenerated.');
    }
    
    // Ensure the value is properly serialized as JSON
    const jsonValue = JSON.parse(JSON.stringify(settings));
    
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
  } catch (error: any) {
    console.error('Error saving banking settings:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    throw error;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can access banking settings.', success: false },
        { status: 403 }
      );
    }

    const settings = await loadBankingSettings();

    return NextResponse.json({ 
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching banking settings:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching banking settings.', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can update banking settings.', success: false },
        { status: 403 }
      );
    }

    const { settings } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data.', success: false },
        { status: 400 }
      );
    }

    await saveBankingSettings(settings);

    return NextResponse.json({ 
      success: true,
      message: 'Banking settings saved successfully.',
      settings
    });
  } catch (error: any) {
    console.error('Error updating banking settings:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    
    // Return more detailed error message for debugging
    const errorMessage = error?.message || 'An error occurred while updating banking settings.';
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
        details: process.env.NODE_ENV === 'development' ? {
          code: error?.code,
          meta: error?.meta,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

