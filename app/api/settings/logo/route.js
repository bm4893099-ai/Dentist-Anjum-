import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { base64 } = await request.json();

    if (!base64) {
      return NextResponse.json({ success: false, error: 'No image data provided.' }, { status: 400 });
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const logoPath = join(process.cwd(), 'public', 'logo.png');
    await writeFile(logoPath, buffer);

    return NextResponse.json({ success: true, message: 'Logo updated successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
