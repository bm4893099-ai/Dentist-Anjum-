import AboutSection from '@/components/AboutSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AppointmentForm from '@/components/AppointmentForm';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us | Anjum Dentist',
  description:
    'Learn about Anjum Dentist — 15+ years of trusted dental care in Karachi, Pakistan.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="pt-36 pb-24 bg-teal-50 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-4 py-1.5 mb-6">
            <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
            <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">Our Story</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            About{' '}
            <span className="text-teal-600">Anjum Dentist</span>
          </h1>

          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            For over 15 years, we have been transforming smiles and building confidence — one patient at a time. Rooted in Karachi, committed to excellence.
          </p>
        </div>
      </section>

      <StatsSection />
      <AboutSection />
      <TestimonialsSection />
      <AppointmentForm />
    </>
  );
}
