import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    console.log('[Upload] Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid overwrites (timestamp + random + original name)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const ext = path.extname(sanitizedName) || '.jpg';
    const baseName = path.basename(sanitizedName, ext);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName.slice(0, 20)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    console.log('[Upload] Creating directory:', uploadDir);
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (dirError: any) {
      console.error('[Upload] Directory creation error:', dirError);
      // Continue anyway - directory might already exist
    }

    const filepath = path.join(uploadDir, filename);
    console.log('[Upload] Writing file to:', filepath);
    
    await writeFile(filepath, buffer);
    console.log('[Upload] File written successfully');
    
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error('[Upload] Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      stack: error.stack,
    });
    
    // Provide more specific error messages
    if (error.code === 'ENOENT' || error.code === 'EACCES') {
      return NextResponse.json({ 
        error: 'File system error. On serverless platforms like Vercel, file uploads may not persist. Consider using cloud storage.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
