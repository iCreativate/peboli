import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'Peboli';
    const subtitle = typeof body?.subtitle === 'string' && body.subtitle.trim() ? body.subtitle.trim() : '';
    const countRaw = Number(body?.count);
    const count = Number.isFinite(countRaw) && countRaw > 0 ? Math.min(Math.round(countRaw), 8) : 3;

    const palettes = [
      ['#0B1220', '#FF6B4A'],
      ['#050A14', '#0A1F44'],
      ['#0B1220', '#00C48C'],
      ['#1A1D29', '#FF8A6B'],
      ['#0B1220', '#1A1D29'],
      ['#0A1F44', '#00C48C'],
      ['#0B1220', '#FF6B4A', '#00C48C'],
      ['#050A14', '#FF6B4A', '#1A1D29'],
    ];

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const urls: string[] = [];

    for (let i = 0; i < count; i++) {
      const palette = palettes[i % palettes.length];
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-hero-${i}`;
      const filename = `${id}.svg`;
      const filepath = path.join(uploadDir, filename);

      const gradientStops = palette
        .map((c, idx) => `<stop offset="${Math.round((idx / (palette.length - 1)) * 100)}%" stop-color="${c}" />`)
        .join('');

      const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="600" viewBox="0 0 1920 600">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      ${gradientStops}
    </linearGradient>
    <radialGradient id="r${id}" cx="30%" cy="50%" r="80%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.12)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
  </defs>
  <rect width="1920" height="600" fill="url(#g${id})"/>
  <rect width="1920" height="600" fill="url(#r${id})"/>
  <g filter="url(#shadow${id})"></g>
  <text x="50%" y="48%" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="84" font-weight="900" fill="#FFFFFF" opacity="0.95">
    ${escapeText(title)}
  </text>
  ${subtitle ? `<text x="50%" y="60%" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="28" font-weight="600" fill="#FFFFFF" opacity="0.85">
    ${escapeText(subtitle)}
  </text>` : ''}
</svg>`;

      await writeFile(filepath, svg, 'utf8');
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Generate hero error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function escapeText(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

