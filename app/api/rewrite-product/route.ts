import { NextResponse } from 'next/server';

type RewriteRequest = {
  sourceUrl?: string;
  title?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: number;
  compareAtPrice?: number;
};

type RewriteResponse = {
  title: string;
  description: string;
  brand?: string;
  category?: string;
  price?: number;
  compareAtPrice?: number;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not set. Add it to your environment to enable AI rewrite.' },
      { status: 400 }
    );
  }

  const body = (await request.json()) as RewriteRequest;

  const prompt = {
    role: 'user',
    content: [
      'You are writing product copy for an ecommerce marketplace called Peboli.',
      'Analyze the provided product info and generate/rewrite the following fields:',
      '1. title: Clean, premium, descriptive (no spammy keywords).',
      '2. description: Sales-friendly, concise, persuasive.',
      '3. brand: Infer the brand name if possible.',
      '4. category: Suggest the best fitting category slug from: [electronics, fashion, home, beauty, sports, baby, liquor, gaming, books, automotive, pets, health, office, toys].',
      '5. price: Suggest a price in ZAR (South African Rand) if a price is provided (convert if needed, assume 1 USD = 19 ZAR if currency is USD). Return a number.',
      '6. compareAtPrice: Suggest a higher "was" price if appropriate (e.g. if on sale). Return a number.',
      '',
      '- Avoid copying the source description verbatim.',
      '- Do not mention the source store (Amazon/Takealot/etc.).',
      '- Return strict JSON with keys: title, description, brand, category, price, compareAtPrice.',
      '',
      `Source URL: ${body.sourceUrl || ''}`,
      `Brand: ${body.brand || ''}`,
      `Category: ${body.category || ''}`,
      `Imported Title: ${body.title || ''}`,
      `Imported Description: ${body.description || ''}`,
      `Price: ${typeof body.price === 'number' ? body.price : ''}`,
      `CompareAtPrice: ${typeof body.compareAtPrice === 'number' ? body.compareAtPrice : ''}`,
    ].join('\n'),
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: 'You generate structured JSON only. No markdown. No additional keys.',
        },
        prompt,
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `OpenAI request failed (${res.status}): ${text}` }, { status: 502 });
  }

  const json = (await res.json()) as any;
  const content = json?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'OpenAI returned no content' }, { status: 502 });
  }

  let parsed: RewriteResponse;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response JSON' }, { status: 502 });
  }

  if (!parsed?.title || !parsed?.description) {
    return NextResponse.json({ error: 'AI response missing required fields' }, { status: 502 });
  }

  return NextResponse.json({
    title: parsed.title,
    description: parsed.description,
    brand: parsed.brand,
    category: parsed.category,
    price: parsed.price,
    compareAtPrice: parsed.compareAtPrice,
  });
}
