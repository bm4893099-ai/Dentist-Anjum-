import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: '+92 300 1234567',
    },
    email: {
      type: String,
      default: 'info@anjumdentist.com',
    },
    address: {
      type: String,
      default: '123 Dental Street, Clifton, Karachi, Pakistan',
    },
    footerCopyright: {
      type: String,
      default: '© 2024 Anjum Dentist. All Rights Reserved.',
    },
    facebookUrl: {
      type: String,
      default: '#',
    },
    instagramUrl: {
      type: String,
      default: '#',
    },
    twitterUrl: {
      type: String,
      default: '#',
    },
    whatsappNumber: {
      type: String,
      default: '+923001234567',
    },
    workingHours: {
      type: String,
      default: 'Mon–Sat: 9:00 AM – 7:00 PM',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model('Settings', SettingsSchema);
