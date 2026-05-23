import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    preferredDate: {
      type: String,
      required: [true, 'Preferred date is required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: [
        'General Checkup & Cleaning',
        'Teeth Whitening',
        'Orthodontics (Braces/Aligners)',
        'Root Canal Treatment',
        'Dental Implants',
        'Tooth Extraction',
        'Cosmetic Dentistry',
        'Pediatric Dentistry',
        'Gum Treatment',
        'Dental Crown & Bridge',
      ],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Appointment ||
  mongoose.model('Appointment', AppointmentSchema);
