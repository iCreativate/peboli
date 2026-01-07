import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function extFromContentType(ct?: string | null) {
  if (!ct) return null;
  const type = ct.split(';')[0].trim().toLowerCase();
  if (type === 'image/jpeg' || type === 'image/jpg') return '.jpg';
  if (type === 'image/png') return '.png';
  if (type === 'image/webp') return '.webp';
  if (type === 'image/gif') return '.gif';
  if (type === 'image/svg+xml') return '.svg';
  return null;
}

function extFromUrl(url: string) {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname);
    const m = base.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
    return m ? `.${m[1].toLowerCase()}` : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const urls = Array.isArray(body?.urls) ? (body.urls as unknown[]) : [];
    const srcs = urls.filter((u): u is string => typeof u === 'string');
    if (!srcs.length) {
      return NextResponse.json({ error: 'No image urls provided' }, { status: 400 });
    }

    const results: { source: string; url?: string; error?: string }[] = [];
    for (const source of srcs.slice(0, 12)) {
      try {
        const res = await fetch(source, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        });
        if (!res.ok) {
          results.push({ source, error: `Fetch failed (${res.status})` });
          continue;
        }
        const ct = res.headers.get('content-type');
        const buf = Buffer.from(await res.arrayBuffer());
        const byCt = extFromContentType(ct);
        const byUrl = extFromUrl(source);
        const ext = byCt || byUrl || '.jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Ensure upload directory exists
        await mkdir(uploadDir, { recursive: true });
        
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buf);
        results.push({ source, url: `/uploads/${filename}` });
      } catch (e: any) {
        console.error('Error downloading image:', source, e.message || e);
        results.push({ source, error: e.message || 'Download failed' });
      }
    }

    const saved = results.filter((r) => r.url).map((r) => r.url as string);
    return NextResponse.json({ urls: saved, results });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
