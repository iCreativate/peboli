/** Local Shelf resale markup: honest 30–40% on landed cost (default 35%). */

export const MARKUP_MIN = 30;
export const MARKUP_MAX = 40;
export const MARKUP_DEFAULT = 35;

export function clampMarkupPercent(value: number): number {
  if (!Number.isFinite(value)) return MARKUP_DEFAULT;
  return Math.min(MARKUP_MAX, Math.max(MARKUP_MIN, Math.round(value)));
}

/** Base cost for markup — prefers landedCost when set. */
export function resolveBaseCost(cost: number, landedCost?: number | null): number {
  if (landedCost != null && Number.isFinite(landedCost) && landedCost > 0) {
    return landedCost;
  }
  return cost;
}

/** Sell price = base cost × (1 + markup/100), rounded to whole rands. */
export function calculateSellPrice(
  cost: number,
  markupPercent: number = MARKUP_DEFAULT,
  landedCost?: number | null
): number {
  const base = resolveBaseCost(cost, landedCost);
  if (!Number.isFinite(base) || base <= 0) return 0;
  const markup = clampMarkupPercent(markupPercent);
  return Math.round(base * (1 + markup / 100));
}
