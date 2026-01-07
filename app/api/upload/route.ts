import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

    // Create a unique filename to avoid overwrites (timestamp + random + original name)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const ext = path.extname(sanitizedName) || '.jpg';
    const baseName = path.basename(sanitizedName, ext);
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName.slice(0, 20)}${ext}`;

    console.log('[Upload] Uploading to Vercel Blob Storage:', filename);
    
    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    console.log('[Upload] File uploaded successfully:', blob.url);
    
    return NextResponse.json({ success: true, url: blob.url });
  } catch (error: any) {
    console.error('[Upload] Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    return NextResponse.json({ 
      error: error.message || 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
