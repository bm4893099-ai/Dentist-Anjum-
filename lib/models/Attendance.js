import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffUser', required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true },
  checkIn: { type: String, default: '' },
  status: { type: String, enum: ['Present', 'Late', 'Absent'], default: 'Present' },
  method: { type: String, enum: ['QR', 'Manual'], default: 'QR' },
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
