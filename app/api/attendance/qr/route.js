import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = createHmac('sha256', secret).update(today).digest('hex').substring(0, 16);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const qrContent = `${baseUrl}/user/scan?token=${token}&date=${today}`;
    return NextResponse.json({ success: true, token, date: today, qrContent });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
