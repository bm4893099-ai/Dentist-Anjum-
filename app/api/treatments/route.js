import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Treatment from '@/lib/models/Treatment';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const treatments = await Treatment.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: treatments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Treatment name is required.' }, { status: 400 });
    }
    const treatment = await Treatment.create(body);
    return NextResponse.json({ success: true, data: treatment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
