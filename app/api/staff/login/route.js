import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffUser from '@/lib/models/StaffUser';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { phone, password } = await request.json();
    if (!phone || !password) {
      return NextResponse.json({ success: false, error: 'Phone and password are required.' }, { status: 400 });
    }
    const user = await StaffUser.findOne({ phone, isActive: true });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const token = await new SignJWT({ id: user._id.toString(), name: user.name, phone: user.phone, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
    response.cookies.set('staff_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
