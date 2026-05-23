import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';

export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { fullName, email, phone, preferredDate, preferredTime, serviceType } = body;

    if (!fullName || !email || !phone || !preferredDate || !preferredTime || !serviceType) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be completed.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create(body);

    return NextResponse.json(
      { success: true, data: appointment, message: 'Appointment booked successfully!' },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
