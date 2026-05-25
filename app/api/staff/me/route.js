import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.json({ success: true, data: payload });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid session.' }, { status: 401 });
  }
}
