import ServicesSection from '@/components/ServicesSection';
import AppointmentForm from '@/components/AppointmentForm';
import { Sparkles, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Dental Services | Anjum Dentist',
  description:
    'Explore our full range of premium dental services — from routine checkups to complete smile transformations.',
};

const highlights = [
  'State-of-the-art digital X-ray technology',
  'Painless injection techniques',
  'ISO-certified sterilization protocols',
  'Flexible EMI payment plans available',
  'Walk-in & emergency appointments',
  'Child-friendly treatment rooms',
];

export default function ServicesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="pt-36 pb-24 bg-teal-50 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">
              Comprehensive Dental Care
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            World-Class{' '}
            <span className="text-teal-600">Dental Services</span>
          </h1>

          <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From your first checkup to a complete smile transformation, we offer every dental service under one roof — with care, precision, and zero pain.
          </p>

          <a href="#appointment" className="btn-primary text-base px-8 py-4">
            Book a Free Consultation
          </a>
        </div>
      </section>

      {/* Highlights strip */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-teal-500 fill-teal-100 flex-shrink-0" />
                <span className="text-slate-700 text-sm font-semibold">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <AppointmentForm />
    </>
  );
}
