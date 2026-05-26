import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const settings = await Settings.findOne({}).select('logoData');

    const hasVersion = new URL(request.url).searchParams.has('v');
    const cacheControl = hasVersion
      ? 'public, max-age=31536000, immutable'
      : 'no-store';

    if (settings?.logoData) {
      const match = settings.logoData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const contentType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        return new NextResponse(buffer, {
          headers: { 'Content-Type': contentType, 'Cache-Control': cacheControl },
        });
      }
    }

    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'logo.png');
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': cacheControl },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
