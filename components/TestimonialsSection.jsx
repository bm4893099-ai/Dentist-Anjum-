'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ayesha Siddiqui',
    role: 'Marketing Executive',
    rating: 5,
    text: 'Absolutely the best dental experience I have ever had! Dr. Anjum and his team made me feel completely at ease. The teeth whitening results were incredible — I could not stop smiling after.',
    service: 'Teeth Whitening',
    initials: 'AS',
    color: 'from-teal-500 to-cyan-400',
  },
  {
    name: 'Muhammad Bilal',
    role: 'Software Engineer',
    rating: 5,
    text: 'I was terrified of root canals but the team made it completely painless. The clinic is spotless, modern, and the staff is incredibly professional. Highly recommend to anyone avoiding the dentist out of fear!',
    service: 'Root Canal Treatment',
    initials: 'MB',
    color: 'from-violet-500 to-purple-400',
  },
  {
    name: 'Sara Fatima',
    role: 'School Teacher',
    rating: 5,
    text: 'Brought my 7-year-old here and the pediatric team was fantastic. They made my daughter laugh the whole time! Clean, safe, and genuinely caring. We will not go anywhere else.',
    service: 'Pediatric Dentistry',
    initials: 'SF',
    color: 'from-rose-500 to-pink-400',
  },
  {
    name: 'Ahmed Raza',
    role: 'Business Owner',
    rating: 5,
    text: 'The dental implant procedure was smooth, professional, and painless. The follow-up care was exceptional. My smile has been completely transformed and I feel so much more confident in meetings.',
    service: 'Dental Implants',
    initials: 'AR',
    color: 'from-emerald-500 to-green-400',
  },
  {
    name: 'Zara Hussain',
    role: 'Medical Student',
    rating: 5,
    text: 'Got my braces fitted here and the whole process from consultation to fitting was seamless. The digital X-rays and 3D mapping are state-of-the-art. Worth every rupee!',
    service: 'Orthodontics',
    initials: 'ZH',
    color: 'from-amber-500 to-yellow-400',
  },
  {
    name: 'Omar Sheikh',
    role: 'Architect',
    rating: 5,
    text: 'The cosmetic smile makeover at Anjum Dentist genuinely changed my life. The veneers look so natural that nobody believes they are not my real teeth. The attention to detail is remarkable.',
    service: 'Cosmetic Dentistry',
    initials: 'OS',
    color: 'from-cyan-500 to-sky-400',
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const cols = 3;

  const prev = () => setActive((a) => (a === 0 ? Math.max(0, testimonials.length - cols) : a - 1));
  const next = () =>
    setActive((a) => (a >= testimonials.length - cols ? 0 : a + 1));

  const visible = testimonials.slice(active, active + cols);
  const fill = visible.length < cols ? testimonials.slice(0, cols - visible.length) : [];
  const cards = [...visible, ...fill].slice(0, cols);

  return (
    <section className="section-padding bg-slate-50 overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-amber-700 text-xs font-bold tracking-wide uppercase">Patient Testimonials</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              What Our <span className="text-gradient-teal">Patients Say</span>
            </h2>
            <p className="text-slate-500 text-lg mt-3 max-w-lg">
              Hundreds of satisfied patients trust Anjum Dentist for their smile transformations.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="group relative bg-white rounded-3xl p-6 flex flex-col border border-slate-100 hover:border-teal-100 hover:-translate-y-1.5 transition-all duration-300 ease-in-out overflow-hidden"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(13,148,136,0.10), 0 4px 16px rgba(0,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)'}
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-5 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300">
                <Quote className="w-14 h-14 text-teal-600" />
              </div>

              {/* Service tag */}
              <div className="inline-flex w-fit mb-4 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
                {t.service}
              </div>

              {/* Stars */}
              <StarRating rating={t.rating} />

              {/* Text */}
              <p className="text-slate-600 text-sm leading-relaxed mt-3 flex-1 font-light">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm tracking-tight">{t.name}</p>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(Math.min(i, testimonials.length - cols))}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === active ? 'w-8 h-2.5 bg-teal-600' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-teal-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
