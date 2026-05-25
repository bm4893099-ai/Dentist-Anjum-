import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffUser from '@/lib/models/StaffUser';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const user = await StaffUser.findByIdAndUpdate(params.id, body, { new: true }).select('-password');
    if (!user) return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await StaffUser.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
