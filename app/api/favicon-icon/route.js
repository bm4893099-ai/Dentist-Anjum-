import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 'no-store, must-revalidate' };

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne({}).select('faviconData').lean();

    if (settings?.faviconData) {
      const idx = settings.faviconData.indexOf(',');
      if (idx > -1) {
        const meta = settings.faviconData.substring(0, idx);
        const b64 = settings.faviconData.substring(idx + 1);
        const contentType = meta.replace('data:', '').replace(';base64', '');
        const buffer = Buffer.from(b64, 'base64');
        return new NextResponse(buffer, {
          headers: { 'Content-Type': contentType, ...HEADERS },
        });
      }
    }

    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    const buf = await readFile(join(process.cwd(), 'public', 'favicon.png'));
    return new NextResponse(buf, {
      headers: { 'Content-Type': 'image/png', ...HEADERS },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
