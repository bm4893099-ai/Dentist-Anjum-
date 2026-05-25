import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  treatmentName: { type: String, default: '' },
  sessionCount: { type: Number, default: 1 },
  pricePerSession: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['%', 'PKR'], default: '%' },
  finalAmount: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  invoiceNumber: { type: String },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
}, { timestamps: true });

PatientSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.models.Patient.countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
