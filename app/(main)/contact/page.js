import ContactSection from '@/components/ContactSection';
import AppointmentForm from '@/components/AppointmentForm';
import { MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Anjum Dentist',
  description:
    'Get in touch with Anjum Dentist. Book an appointment, ask a question, or find our clinic location in Karachi.',
};

export default function ContactPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="pt-36 pb-24 bg-teal-50 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-4 py-1.5 mb-6">
            <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">Contact Us</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            We&apos;re Here to{' '}
            <span className="text-teal-600">Help You</span>
          </h1>

          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question, concern, or ready to book? Reach out to our friendly team — we respond within 2 hours.
          </p>
        </div>
      </section>

      <ContactSection />
      <AppointmentForm />
    </>
  );
}
