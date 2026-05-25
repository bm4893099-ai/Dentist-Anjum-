import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { base64 } = await request.json();

    if (!base64) {
      return NextResponse.json({ success: false, error: 'No image data provided.' }, { status: 400 });
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const faviconPath = join(process.cwd(), 'public', 'favicon.png');
    await writeFile(faviconPath, buffer);

    const newVersion = Date.now();
    await connectDB();
    await Settings.findOneAndUpdate(
      {},
      { faviconVersion: newVersion },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, faviconVersion: newVersion, message: 'Favicon updated successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
