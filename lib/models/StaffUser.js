import mongoose from 'mongoose';

const StaffUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Receptionist', 'Dentist', 'Assistant', 'Manager', 'Cleaner'],
    default: 'Receptionist',
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.StaffUser || mongoose.model('StaffUser', StaffUserSchema);
