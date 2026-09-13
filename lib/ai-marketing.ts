/**
 * Peboli AI Reseller Studio — Local Shelf marketing + profit engine.
 * Works offline with a smart template engine; uses OpenAI when OPENAI_API_KEY is set.
 */

import {
  MARKUP_DEFAULT,
  MARKUP_MAX,
  MARKUP_MIN,
  calculateSellPrice,
  clampMarkupPercent,
} from '@/lib/pricing';

export type MarketingTone = 'urgent' | 'friendly' | 'premium' | 'local';
export type MarketingChannel =
  | 'listing'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'deal'
  | 'email'
  | 'full_pack';

export interface MarketingGenerateInput {
  productName: string;
  category?: string;
  cost: number;
  markupPercent?: number;
  keyBenefits?: string;
  audience?: string;
  tone?: MarketingTone;
  channel?: MarketingChannel;
  location?: string;
}

export interface ProfitSnapshot {
  cost: number;
  markupPercent: number;
  sellPrice: number;
  profitPerUnit: number;
  marginPercent: number;
  breakEvenUnitsAtAdSpend: (adSpend: number) => number;
}

export interface ResellerPackage {
  id: string;
  name: string;
  priceZar: number;
  deliverables: string[];
  targetClient: string;
  estimatedHours: number;
  suggestedMarginNote: string;
}

export interface MarketingPack {
  productTitle: string;
  titleAlternates: string[];
  shortDescription: string;
  longDescription: string;
  bulletPoints: string[];
  whatsappBlast: string;
  instagramCaption: string;
  facebookPost: string;
  dealHeadline: string;
  dealSubcopy: string;
  emailSubject: string;
  emailBody: string;
  hashtags: string[];
  ctaOptions: string[];
  profit: ProfitSnapshot;
  resellerPackages: ResellerPackage[];
  playbookSteps: string[];
  source: 'openai' | 'peboli-engine';
}

const TONE_FLAVOUR: Record<MarketingTone, { vibe: string; closer: string }> = {
  urgent: {
    vibe: 'limited stock, act fast',
    closer: 'Grab yours before it sells out.',
  },
  friendly: {
    vibe: 'neighbourly and helpful',
    closer: 'Message us — we\'re happy to help.',
  },
  premium: {
    vibe: 'quality-first and polished',
    closer: 'Serious about quality? This one\'s for you.',
  },
  local: {
    vibe: 'proudly Gauteng / SA local',
    closer: 'Local stock. Fast handoff. Zero import hassle.',
  },
};

function cleanName(name: string): string {
  return name.replace(/^SAMPLE\s*[—\-]\s*/i, '').trim();
}

function pickBenefits(input: MarketingGenerateInput): string[] {
  const raw = (input.keyBenefits || '')
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (raw.length >= 3) return raw.slice(0, 5);

  const category = (input.category || 'general').toLowerCase();
  const defaults: Record<string, string[]> = {
    home: ['Ready for everyday use', 'Solid build quality', 'Easy to clean'],
    kitchen: ['Saves prep time', 'Durable for daily cooking', 'Easy to store'],
    beauty: ['Gentle everyday formula', 'Visible results', 'Travel-friendly size'],
    fashion: ['Comfortable fit', 'Looks sharp', 'Easy to style'],
    electronics: ['Reliable performance', 'Ready out the box', 'Great value'],
    kids: ['Safe for little ones', 'Durable for play', 'Parent-approved pick'],
    general: ['Honest local pricing', 'In-stock in Gauteng', 'Fast WhatsApp checkout'],
  };

  const key = Object.keys(defaults).find((k) => category.includes(k)) || 'general';
  return [...raw, ...defaults[key]].slice(0, 5);
}

export function buildProfitSnapshot(
  cost: number,
  markupPercent: number = MARKUP_DEFAULT
): ProfitSnapshot {
  const markup = clampMarkupPercent(markupPercent);
  const sellPrice = calculateSellPrice(cost, markup);
  const profitPerUnit = Math.max(0, sellPrice - cost);
  const marginPercent = sellPrice > 0 ? Math.round((profitPerUnit / sellPrice) * 1000) / 10 : 0;

  return {
    cost,
    markupPercent: markup,
    sellPrice,
    profitPerUnit,
    marginPercent,
    breakEvenUnitsAtAdSpend: (adSpend: number) =>
      profitPerUnit > 0 ? Math.ceil(Math.max(0, adSpend) / profitPerUnit) : Infinity,
  };
}

export function getDefaultResellerPackages(profit: ProfitSnapshot): ResellerPackage[] {
  return [
    {
      id: 'starter',
      name: 'Starter Blast',
      priceZar: 450,
      deliverables: [
        '1 product listing rewrite',
        '1 WhatsApp blast',
        '5 hashtags + CTA options',
      ],
      targetClient: 'Solo sellers & tuck-shop style local stockists',
      estimatedHours: 1,
      suggestedMarginNote: `At ~R${profit.profitPerUnit}/unit product profit, this package funds ~${Math.max(1, Math.floor(450 / Math.max(profit.profitPerUnit, 1)))} units of ad budget.`,
    },
    {
      id: 'growth',
      name: 'Growth Pack',
      priceZar: 1200,
      deliverables: [
        'Full listing pack (title + bullets + description)',
        'WhatsApp + Instagram + Facebook copy',
        'Deal headline set',
        '1 email subject + body',
      ],
      targetClient: 'Local Shelf resellers running weekly drops',
      estimatedHours: 2.5,
      suggestedMarginNote: 'Charge monthly retainers (R2500-R4000) once they rebook weekly.',
    },
    {
      id: 'agency',
      name: 'Agency Retainer',
      priceZar: 3500,
      deliverables: [
        '4 weekly campaign packs',
        'Promo calendar suggestions',
        'Price & markup coaching (30–40%)',
        'Performance checklist',
      ],
      targetClient: 'Small retailers / multi-product Local Shelf operators',
      estimatedHours: 6,
      suggestedMarginNote: 'White-label under your brand; keep OpenAI cost under R150/month.',
    },
  ];
}

function buildPlaybook(profit: ProfitSnapshot, location: string): string[] {
  return [
    `Source local stock in ${location} and record landed cost honestly.`,
    `Set sell price at ${profit.markupPercent}% markup → R${profit.sellPrice} (≈ R${profit.profitPerUnit} profit/unit).`,
    'Generate a full marketing pack before you list — title, WhatsApp, and social in one go.',
    'Post WhatsApp status + community groups first (highest local conversion).',
    'Offer EFT / WhatsApp pay-after-order — keep checkout friction low.',
    'Resell the same AI packs to nearby shops as Starter / Growth / Agency packages.',
    'Reinvest 10–20% of profit into boosts only after organic WhatsApp traction.',
  ];
}

function buildEnginePack(input: MarketingGenerateInput): MarketingPack {
  const name = cleanName(input.productName);
  const tone = input.tone || 'local';
  const flavour = TONE_FLAVOUR[tone];
  const location = input.location || 'Gauteng';
  const audience = input.audience || `smart shoppers in ${location}`;
  const category = input.category || 'everyday essentials';
  const benefits = pickBenefits(input);
  const profit = buildProfitSnapshot(input.cost, input.markupPercent);
  const priceLabel = `R${profit.sellPrice}`;

  const productTitle = `${name} — ${benefits[0] || 'Local Shelf deal'} | ${priceLabel}`;
  const titleAlternates = [
    `${name} for ${audience} | ${priceLabel}`,
    `Best ${category}: ${name} (${priceLabel})`,
    `${name} · In stock ${location} · ${priceLabel}`,
  ];

  const shortDescription = `${name} — ${flavour.vibe}. Built for ${audience}. ${benefits.slice(0, 2).join('. ')}. Honest Local Shelf pricing at ${priceLabel}.`;

  const longDescription = [
    `Meet ${name}, curated for ${audience} who want ${category} without import headaches.`,
    `${flavour.vibe.charAt(0).toUpperCase() + flavour.vibe.slice(1)}.`,
    `Why it sells: ${benefits.join('; ')}.`,
    `Priced at ${priceLabel} with a transparent ${profit.markupPercent}% Local Shelf markup — you keep ≈ R${profit.profitPerUnit} per unit.`,
    flavour.closer,
  ].join(' ');

  const whatsappBlast = [
    `🔥 *${name}* — now ${priceLabel}`,
    ``,
    benefits.map((b) => `✅ ${b}`).join('\n'),
    ``,
    `📍 ${location} stock · Local Shelf`,
    `💬 Reply *BUY* or WhatsApp to order (EFT available).`,
    flavour.closer,
  ].join('\n');

  const hashtags = [
    '#Peboli',
    '#LocalShelf',
    `#${location.replace(/\s+/g, '')}`,
    '#SouthAfricaDeals',
    '#BestDealsZeroHassle',
    `#${category.replace(/\s+/g, '')}`,
  ].slice(0, 6);

  const instagramCaption = [
    `${name} just dropped for ${audience}.`,
    ``,
    shortDescription,
    ``,
    `Price: ${priceLabel}`,
    flavour.closer,
    ``,
    hashtags.join(' '),
  ].join('\n');

  const facebookPost = [
    `Looking for ${category} in ${location}?`,
    ``,
    `${name} is in stock at ${priceLabel}.`,
    benefits.map((b) => `• ${b}`).join('\n'),
    ``,
    `Order via WhatsApp / EFT — best deals, zero hassle.`,
    flavour.closer,
  ].join('\n');

  const dealHeadline = `${name} · ${priceLabel} splash`;
  const dealSubcopy = `${benefits[0] || 'Local stock'} — ${flavour.closer}`;

  const emailSubject = `${name} is live at ${priceLabel} — Local Shelf pick`;
  const emailBody = [
    `Hi there,`,
    ``,
    `Quick heads-up: ${name} is available now for ${audience}.`,
    longDescription,
    ``,
    `Order on Peboli or reply to this email / WhatsApp us.`,
    ``,
    `— Peboli Local Shelf`,
  ].join('\n');

  return {
    productTitle,
    titleAlternates,
    shortDescription,
    longDescription,
    bulletPoints: benefits,
    whatsappBlast,
    instagramCaption,
    facebookPost,
    dealHeadline,
    dealSubcopy,
    emailSubject,
    emailBody,
    hashtags,
    ctaOptions: [
      'Order on WhatsApp',
      'Pay via EFT — reference sent after checkout',
      'Grab the Local Shelf deal',
      'Message BUY to reserve yours',
    ],
    profit,
    resellerPackages: getDefaultResellerPackages(profit),
    playbookSteps: buildPlaybook(profit, location),
    source: 'peboli-engine',
  };
}

async function tryOpenAI(input: MarketingGenerateInput): Promise<MarketingPack | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const profit = buildProfitSnapshot(input.cost, input.markupPercent);
  const tone = input.tone || 'local';
  const location = input.location || 'Gauteng';

  const system = `You are Peboli Local Shelf's SA marketing copywriter. Write concise, conversion-focused copy for Gauteng/South Africa product resale. Currency is ZAR (R). Never invent false claims. Return strict JSON matching the schema.`;

  const user = JSON.stringify({
    task: 'Generate a full marketing pack + reseller packages for this product',
    product: input,
    pricing: profit,
    tone,
    location,
    schema: {
      productTitle: 'string',
      titleAlternates: 'string[3]',
      shortDescription: 'string',
      longDescription: 'string',
      bulletPoints: 'string[3-5]',
      whatsappBlast: 'string',
      instagramCaption: 'string',
      facebookPost: 'string',
      dealHeadline: 'string',
      dealSubcopy: 'string',
      emailSubject: 'string',
      emailBody: 'string',
      hashtags: 'string[4-8]',
      ctaOptions: 'string[3-5]',
      playbookSteps: 'string[5-7]',
    },
  });

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    return {
      productTitle: String(parsed.productTitle || ''),
      titleAlternates: Array.isArray(parsed.titleAlternates)
        ? parsed.titleAlternates.map(String)
        : [],
      shortDescription: String(parsed.shortDescription || ''),
      longDescription: String(parsed.longDescription || ''),
      bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints.map(String) : [],
      whatsappBlast: String(parsed.whatsappBlast || ''),
      instagramCaption: String(parsed.instagramCaption || ''),
      facebookPost: String(parsed.facebookPost || ''),
      dealHeadline: String(parsed.dealHeadline || ''),
      dealSubcopy: String(parsed.dealSubcopy || ''),
      emailSubject: String(parsed.emailSubject || ''),
      emailBody: String(parsed.emailBody || ''),
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [],
      ctaOptions: Array.isArray(parsed.ctaOptions) ? parsed.ctaOptions.map(String) : [],
      profit,
      resellerPackages: getDefaultResellerPackages(profit),
      playbookSteps: Array.isArray(parsed.playbookSteps)
        ? parsed.playbookSteps.map(String)
        : buildPlaybook(profit, location),
      source: 'openai',
    };
  } catch {
    return null;
  }
}

export function validateMarketingInput(body: unknown): MarketingGenerateInput | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Invalid JSON body' };
  const b = body as Record<string, unknown>;
  const productName = String(b.productName || '').trim();
  if (!productName || productName.length < 2) return { error: 'productName is required' };

  const cost = Number(b.cost);
  if (!Number.isFinite(cost) || cost <= 0) return { error: 'cost must be a positive number (ZAR)' };

  let markupPercent = MARKUP_DEFAULT;
  if (b.markupPercent != null) {
    const m = Number(b.markupPercent);
    if (!Number.isFinite(m)) return { error: 'markupPercent must be a number' };
    markupPercent = clampMarkupPercent(m);
  }

  const tone = (b.tone as MarketingTone) || 'local';
  if (!['urgent', 'friendly', 'premium', 'local'].includes(tone)) {
    return { error: 'tone must be urgent | friendly | premium | local' };
  }

  return {
    productName,
    category: b.category ? String(b.category) : undefined,
    cost,
    markupPercent,
    keyBenefits: b.keyBenefits ? String(b.keyBenefits) : undefined,
    audience: b.audience ? String(b.audience) : undefined,
    tone,
    channel: (b.channel as MarketingChannel) || 'full_pack',
    location: b.location ? String(b.location) : 'Gauteng',
  };
}

export async function generateMarketingPack(
  input: MarketingGenerateInput
): Promise<MarketingPack> {
  const fromOpenAI = await tryOpenAI(input);
  if (fromOpenAI?.productTitle) return fromOpenAI;
  return buildEnginePack(input);
}

export { MARKUP_MIN, MARKUP_MAX, MARKUP_DEFAULT };
