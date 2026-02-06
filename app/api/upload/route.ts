import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Ensure upload directory exists
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }

    const urls: string[] = [];

    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Unique filename per file
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        urls.push(`/uploads/${filename}`);
    }
    
    return NextResponse.json({ urls, url: urls[0] });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
