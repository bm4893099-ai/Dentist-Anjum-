import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/lib/models/Patient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const patients = await Patient.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: patients });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: 'Name and phone are required.' }, { status: 400 });
    }
    const patient = await Patient.create(body);
    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
