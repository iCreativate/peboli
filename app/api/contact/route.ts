import { NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const company = body.company?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const entry = {
    receivedAt: new Date().toISOString(),
    name,
    email,
    company,
    message,
  };

  try {
    const dir = path.join(process.cwd(), 'data');
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, 'contact-submissions.jsonl'),
      `${JSON.stringify(entry)}\n`,
      'utf8'
    );
  } catch (error) {
    console.error('Failed to persist contact submission', error);
    return NextResponse.json(
      { error: 'Could not save your message. Please try again.' },
      { status: 500 }
    );
  }

  console.info('[MESH contact]', entry);

  return NextResponse.json({ ok: true });
}
