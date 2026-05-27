import { NextResponse } from 'next/server';
import sharp from 'sharp';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { base64 } = await request.json();

    if (!base64) {
      return NextResponse.json({ success: false, error: 'No image data provided.' }, { status: 400 });
    }

    const idx = base64.indexOf(',');
    const b64 = idx > -1 ? base64.substring(idx + 1) : base64;
    const inputBuffer = Buffer.from(b64, 'base64');

    const webpBuffer = await sharp(inputBuffer)
      .webp({ quality: 90 })
      .toBuffer();

    const logoData = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    const newVersion = Date.now();

    await connectDB();
    await Settings.findOneAndUpdate(
      {},
      { logoData, logoVersion: newVersion },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, logoVersion: newVersion, message: 'Logo updated successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
