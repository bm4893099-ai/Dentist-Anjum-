import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/lib/models/Patient';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const patient = await Patient.findByIdAndUpdate(params.id, body, { new: true });
    if (!patient) return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data: patient });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Patient.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
