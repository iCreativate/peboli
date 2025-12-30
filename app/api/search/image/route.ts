import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;
    if (!file) return NextResponse.json({ query: 'image' }, { status: 200 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const base = file.name.toLowerCase();
    let query = 'image';
    if (/\b(tv|television)\b/.test(base)) query = 'electronics';
    else if (/\b(phone|smartphone)\b/.test(base)) query = 'electronics';
    else if (/\b(shoe|sneaker)\b/.test(base)) query = 'fashion';
    else if (/\b(dress)\b/.test(base)) query = 'fashion';
    else if (/\b(fridge|freezer)\b/.test(base)) query = 'home';
    else if (/\b(stroller|pram)\b/.test(base)) query = 'baby';
    else if (/\b(dumbbell|treadmill)\b/.test(base)) query = 'sports';

    return NextResponse.json({ query, url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ query: 'image' });
  }
}
