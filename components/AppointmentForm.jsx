'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Stethoscope, FileText, Send, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SERVICE_OPTIONS = [
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
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: '',
  serviceType: '',
  notes: '',
};

function InputGroup({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="label-field">
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-teal-500" />
          {label}
        </span>
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <span>✕</span> {error}
        </p>
      )}
    </div>
  );
}

export default function AppointmentForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = 'Full name must be at least 2 characters.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.';
    if (!form.phone.trim() || form.phone.trim().length < 7)
      e.phone = 'Please enter a valid phone number.';
    if (!form.preferredDate) e.preferredDate = 'Please select a preferred date.';
    if (!form.preferredTime) e.preferredTime = 'Please select a preferred time.';
    if (!form.serviceType) e.serviceType = 'Please select a service type.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the highlighted errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
      setForm(INITIAL_FORM);
      toast.success('Appointment booked! We will confirm within 2 hours.');
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="appointment" className="section-padding bg-teal-50">
        <div className="container-max flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-24 h-24 rounded-full bg-teal-100 border-2 border-teal-200 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-teal-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-3">Appointment Booked!</h3>
          <p className="text-slate-500 text-lg mb-2">
            Thank you! Your appointment request has been submitted successfully.
          </p>
          <p className="text-teal-600 font-semibold mb-8">
            Our team will call you within 2 hours to confirm your slot.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Book Another Appointment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="section-padding bg-slate-50 border-y border-slate-100">
      <div className="container-max">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-1.5 mb-5">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">Book Appointment</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
            Schedule Your{' '}
            <span className="text-gradient-teal">Free Consultation</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Fill out the form below and our team will confirm your slot within 2 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-slate-200/60">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <InputGroup label="Full Name" icon={User} error={errors.fullName}>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ayesha Khan"
                    className={`input-field ${
                      errors.fullName ? 'border-red-400 focus:border-red-400' : ''
                    }`}
                  />
                </InputGroup>

                {/* Email */}
                <InputGroup label="Email Address" icon={Mail} error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                  />
                </InputGroup>

                {/* Phone */}
                <InputGroup label="Phone Number" icon={Phone} error={errors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                  />
                </InputGroup>

                {/* Service Type */}
                <InputGroup label="Service Type" icon={Stethoscope} error={errors.serviceType}>
                  <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    className={`input-field ${errors.serviceType ? 'border-red-400' : ''}`}
                  >
                    <option value="" disabled>Select a service...</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </InputGroup>

                {/* Preferred Date */}
                <InputGroup label="Preferred Date" icon={Calendar} error={errors.preferredDate}>
                  <input
                    type="date"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    min={today}
                    className={`input-field ${errors.preferredDate ? 'border-red-400' : ''}`}
                  />
                </InputGroup>

                {/* Preferred Time */}
                <InputGroup label="Preferred Time Slot" icon={Clock} error={errors.preferredTime}>
                  <select
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={handleChange}
                    className={`input-field ${errors.preferredTime ? 'border-red-400' : ''}`}
                  >
                    <option value="" disabled>Choose a time slot...</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </InputGroup>

                {/* Notes — full width */}
                <div className="sm:col-span-2">
                  <InputGroup label="Additional Notes (Optional)" icon={FileText} error={errors.notes}>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell us about any specific concerns, dental history, or questions..."
                      className="input-field resize-none"
                    />
                  </InputGroup>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold text-base rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Booking your appointment...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      Confirm Appointment Booking
                    </>
                  )}
                </button>

                <p className="text-slate-400 text-xs text-center mt-4">
                  By submitting, you agree to be contacted by our clinic team. We respect your privacy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
