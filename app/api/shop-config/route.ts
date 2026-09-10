import { NextResponse } from 'next/server';
import { getEftDetails, getWhatsAppNumber, isImportProductEnabled, isLiquorEnabled, isLocalShelfMode } from '@/lib/local-shelf';
import { MARKUP_DEFAULT, MARKUP_MAX, MARKUP_MIN } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

/** Public-safe Local Shelf configuration (no secrets). */
export async function GET() {
  const eft = getEftDetails();
  return NextResponse.json({
    brand: 'Peboli',
    mode: isLocalShelfMode() ? 'local-shelf' : 'marketplace',
    markup: { min: MARKUP_MIN, max: MARKUP_MAX, default: MARKUP_DEFAULT },
    importProductEnabled: isImportProductEnabled(),
    liquorEnabled: isLiquorEnabled(),
    payment: {
      methods: ['eft', 'whatsapp'],
      eft: {
        bankName: eft.bankName,
        accountName: eft.accountName,
        accountNumber: eft.accountNumber ? `****${eft.accountNumber.slice(-4)}` : '',
        branchCode: eft.branchCode,
        referencePrefix: eft.referencePrefix,
      },
      whatsappConfigured: Boolean(getWhatsAppNumber()),
    },
  });
}
