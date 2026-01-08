import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'payment_integrations';

async function loadPaymentIntegrations() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (setting && setting.value) {
      return setting.value as Record<string, any>;
    }
  } catch (error) {
    console.error('Error loading payment integrations:', error);
  }
  
  // Return default integrations
  return {
    yoco: {
      id: 'yoco',
      name: 'Yoco',
      type: 'yoco',
      isEnabled: false,
    },
    ikhokha: {
      id: 'ikhokha',
      name: 'iKhokha',
      type: 'ikhokha',
      isEnabled: false,
    },
  };
}

async function savePaymentIntegrations(integrations: Record<string, any>) {
  try {
    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: {
        value: integrations,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEY,
        value: integrations,
      },
    });
  } catch (error) {
    console.error('Error saving payment integrations:', error);
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
        { error: 'Only admin@peboli.store can access payment integrations.', success: false },
        { status: 403 }
      );
    }

    const integrations = await loadPaymentIntegrations();
    
    // Convert to array format for frontend
    const integrationsArray = Object.values(integrations);

    return NextResponse.json({ 
      success: true,
      integrations: integrationsArray
    });
  } catch (error) {
    console.error('Error fetching payment integrations:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching payment integrations.', success: false },
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
        { error: 'Only admin@peboli.store can update payment integrations.', success: false },
        { status: 403 }
      );
    }

    const { integration } = await request.json();

    if (!integration || !integration.id) {
      return NextResponse.json(
        { error: 'Invalid integration data.', success: false },
        { status: 400 }
      );
    }

    const integrations = await loadPaymentIntegrations();
    
    // Update the specific integration
    integrations[integration.id] = {
      ...integrations[integration.id],
      ...integration,
    };

    await savePaymentIntegrations(integrations);

    return NextResponse.json({ 
      success: true,
      message: `${integration.name} settings saved successfully.`,
      integration: integrations[integration.id]
    });
  } catch (error) {
    console.error('Error updating payment integration:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating payment integration.', success: false },
      { status: 500 }
    );
  }
}

