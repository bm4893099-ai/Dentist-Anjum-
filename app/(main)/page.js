import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AppointmentForm from '@/components/AppointmentForm';
import ContactSection from '@/components/ContactSection';

export const metadata = {
  title: 'Anjum Dentist | Premium Dental Care — Karachi',
  description:
    'Your smile deserves the best care. Premium, painless dental services in Karachi. Book a free consultation today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <AppointmentForm />
      <ContactSection />
    </>
  );
}
