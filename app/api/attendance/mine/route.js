import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Attendance from '@/lib/models/Attendance';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    await connectDB();
    const records = await Attendance.find({ userId: payload.id }).sort({ date: -1 }).limit(60);
    return NextResponse.json({ success: true, data: records });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed.' }, { status: 500 });
  }
}
