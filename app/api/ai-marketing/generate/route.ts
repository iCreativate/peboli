import { NextRequest, NextResponse } from 'next/server';
import {
  generateMarketingPack,
  validateMarketingInput,
} from '@/lib/ai-marketing';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = validateMarketingInput(body);
    if ('error' in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const pack = await generateMarketingPack(validated);

    // Strip function fields for JSON
    const { profit, ...rest } = pack;
    return NextResponse.json({
      ...rest,
      profit: {
        cost: profit.cost,
        markupPercent: profit.markupPercent,
        sellPrice: profit.sellPrice,
        profitPerUnit: profit.profitPerUnit,
        marginPercent: profit.marginPercent,
        breakEvenAtR100Ads: profit.breakEvenUnitsAtAdSpend(100),
        breakEvenAtR500Ads: profit.breakEvenUnitsAtAdSpend(500),
      },
    });
  } catch (error) {
    console.error('[ai-marketing] generate failed', error);
    return NextResponse.json({ error: 'Failed to generate marketing pack' }, { status: 500 });
  }
}
