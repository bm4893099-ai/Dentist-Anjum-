import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { base64 } = await request.json();

    if (!base64) {
      return NextResponse.json({ success: false, error: 'No image data provided.' }, { status: 400 });
    }

    const newVersion = Date.now();
    await connectDB();
    await Settings.findOneAndUpdate(
      {},
      { logoData: base64, logoVersion: newVersion },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, logoVersion: newVersion, message: 'Logo updated successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
