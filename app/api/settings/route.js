import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  phone: '+92 300 1234567',
  email: 'info@anjumdentist.com',
  address: '123 Dental Street, Clifton, Karachi, Pakistan',
  footerCopyright: '© 2024 Anjum Dentist. All Rights Reserved.',
  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#',
  whatsappNumber: '+923001234567',
  workingHours: 'Mon–Sat: 9:00 AM – 7:00 PM',
};

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({}).select('-logoData -faviconData');

    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();

    let settings = await Settings.findOne({});

    if (!settings) {
      settings = await Settings.create({ ...DEFAULT_SETTINGS, ...body });
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { $set: body },
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
