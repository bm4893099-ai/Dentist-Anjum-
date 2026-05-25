import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/lib/models/Attendance';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const query = date ? { date } : {};
    const records = await Attendance.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: records });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, userName, userPhone, date, token } = body;

    const expectedToken = generateDailyToken(date);
    if (token !== expectedToken) {
      return NextResponse.json({ success: false, error: 'Invalid or expired QR code.' }, { status: 400 });
    }

    const existing = await Attendance.findOne({ userId, date });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Attendance already marked for today.' }, { status: 409 });
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const checkIn = `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    const status = hours >= 9 && (hours < 9 || minutes <= 30) ? 'Present' : hours >= 10 ? 'Late' : 'Present';

    const record = await Attendance.create({ userId, userName, userPhone, date, checkIn, status, method: 'QR' });
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function generateDailyToken(date) {
  const { createHmac } = require('crypto');
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return createHmac('sha256', secret).update(date).digest('hex').substring(0, 16);
}
