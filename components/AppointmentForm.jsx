'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
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
  fullName: '', email: '', phone: '',
  preferredDate: '', preferredTime: '', serviceType: '', notes: '',
};

function Field({ label, error, children, span2 }) {
  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
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
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'At least 2 characters required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.';
    if (!form.phone.trim() || form.phone.trim().length < 7) e.phone = 'Valid phone number required.';
    if (!form.preferredDate) e.preferredDate = 'Please select a date.';
    if (!form.preferredTime) e.preferredTime = 'Please select a time.';
    if (!form.serviceType) e.serviceType = 'Please select a service.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast.error('Please complete all required fields.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      toast.error(err.message || 'Failed to book. Please try again.');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <section id="appointment" className="py-32 bg-white">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-7">
            <CheckCircle className="w-8 h-8 text-teal-800" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Booking Confirmed</h3>
          <p className="text-slate-500 text-base leading-relaxed mb-8">
            Your request has been submitted. Our team will call you within <strong className="text-slate-700">2 hours</strong> to confirm your slot.
          </p>
          <button onClick={() => setSubmitted(false)} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all">
            Book Another <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  const inputCls = (field) =>
    `w-full px-4 py-3.5 rounded-xl border bg-white text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[field]
        ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
        : 'border-slate-200 focus:ring-teal-800/10 focus:border-teal-800'
    }`;

  return (
    <section id="appointment" className="py-28 bg-white border-t border-slate-100">
      <div className="max-w-2xl mx-auto px-6">

        {/* Minimal header */}
        <div className="mb-14">
          <p className="text-teal-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Book Appointment</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight mb-5">
            Schedule your<br />free consultation.
          </h2>
          <p className="text-slate-400 text-base">We confirm your slot within 2 hours.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Step 1 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-6 rounded-full bg-teal-800 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">1</span>
              <p className="text-slate-900 font-bold text-sm tracking-tight">Personal Details</p>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.fullName}>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ayesha Khan" className={inputCls('fullName')} />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 0000000" className={inputCls('phone')} />
              </Field>
              <Field label="Email Address" error={errors.email} span2>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputCls('email')} />
              </Field>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-6 rounded-full bg-teal-800 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">2</span>
              <p className="text-slate-900 font-bold text-sm tracking-tight">Service & Schedule</p>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <Field label="Service Type" error={errors.serviceType} span2>
                <select name="serviceType" value={form.serviceType} onChange={handleChange} className={inputCls('serviceType')}>
                  <option value="" disabled>Select a service...</option>
                  {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Preferred Date" error={errors.preferredDate}>
                <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} min={today} className={inputCls('preferredDate')} />
              </Field>
            </div>
            {/* Time pills */}
            <Field label="Preferred Time" error={errors.preferredTime}>
              <div className="flex flex-wrap gap-2 mt-1">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => { setForm((p) => ({ ...p, preferredTime: t })); if (errors.preferredTime) setErrors((p) => ({ ...p, preferredTime: '' })); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-150 ${
                      form.preferredTime === t
                        ? 'bg-teal-800 border-teal-800 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-teal-800 hover:text-teal-800'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </Field>
          </div>

          {/* Step 3 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[11px] font-black flex items-center justify-center flex-shrink-0">3</span>
              <p className="text-slate-900 font-bold text-sm tracking-tight">Additional Notes <span className="text-slate-400 font-normal">(optional)</span></p>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <textarea
              name="notes" value={form.notes} onChange={handleChange} rows={3}
              placeholder="Any specific concerns, dental history, or questions..."
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-800/10 focus:border-teal-800 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="relative w-full flex items-center justify-center gap-2.5 py-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none" />
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking your appointment...</>
              : <><ArrowRight className="w-4 h-4" /> Confirm Appointment Booking</>
            }
          </button>

          <p className="text-slate-400 text-xs text-center mt-4">
            We respect your privacy. Your details are used only to confirm your booking.
          </p>
        </form>
      </div>
    </section>
  );
}
