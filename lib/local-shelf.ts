/** Peboli Local Shelf — Gauteng/SA honest local-goods resale (not dropship). */

export function isLocalShelfMode(): boolean {
  return process.env.LOCAL_SHELF_MODE !== 'false';
}

export function isImportProductEnabled(): boolean {
  if (process.env.ENABLE_IMPORT_PRODUCT === 'true') return true;
  if (process.env.ENABLE_IMPORT_PRODUCT === 'false') return false;
  return !isLocalShelfMode();
}

export function isLiquorEnabled(): boolean {
  return process.env.ENABLE_LIQUOR === 'true';
}

export function getWhatsAppNumber(): string {
  return process.env.PEBOLI_WHATSAPP_NUMBER?.replace(/\D/g, '') || '';
}

export function getEftDetails() {
  return {
    bankName: process.env.PEBOLI_EFT_BANK_NAME || '',
    accountName: process.env.PEBOLI_EFT_ACCOUNT_NAME || '',
    accountNumber: process.env.PEBOLI_EFT_ACCOUNT_NUMBER || '',
    branchCode: process.env.PEBOLI_EFT_BRANCH_CODE || '',
    referencePrefix: process.env.PEBOLI_EFT_REFERENCE_PREFIX || 'PEB',
  };
}

export function buildWhatsAppOrderUrl(orderNumber: string, total: number, phone?: string): string {
  const waNumber = getWhatsAppNumber();
  if (!waNumber) return '';
  const message = encodeURIComponent(
    `Hi Peboli Local Shelf — I'd like to pay for order ${orderNumber} (R${total.toFixed(0)}). Please send EFT details if needed.`
  );
  return `https://wa.me/${waNumber}?text=${message}`;
}
