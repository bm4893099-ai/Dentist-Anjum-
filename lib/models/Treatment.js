import mongoose from 'mongoose';

const SessionPackageSchema = new mongoose.Schema({
  sessions: { type: Number, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const TreatmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  basePrice: { type: Number, required: true, default: 0 },
  sessionPackages: [SessionPackageSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Treatment || mongoose.model('Treatment', TreatmentSchema);
