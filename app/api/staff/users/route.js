import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffUser from '@/lib/models/StaffUser';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const users = await StaffUser.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, phone, password, role } = await request.json();
    if (!name || !phone || !password) {
      return NextResponse.json({ success: false, error: 'Name, phone, and password are required.' }, { status: 400 });
    }
    const existing = await StaffUser.findOne({ phone });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Phone number already registered.' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await StaffUser.create({ name, phone, password: hashed, role });
    const { password: _, ...safe } = user.toObject();
    return NextResponse.json({ success: true, data: safe }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
