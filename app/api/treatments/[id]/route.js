import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Treatment from '@/lib/models/Treatment';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const treatment = await Treatment.findByIdAndUpdate(params.id, body, { new: true });
    if (!treatment) return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data: treatment });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Treatment.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
