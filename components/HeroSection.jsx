'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Star, CheckCircle, ChevronDown } from 'lucide-react';

const STATS = [
  { value: '5,000+', label: 'Patients Served' },
  { value: '4.9 / 5', label: 'Average Rating' },
  { value: '15+ Yrs', label: 'Experience' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const FEATURES = [
  'Painless, gentle treatment techniques',
  'State-of-the-art digital equipment',
  'Board-certified dental specialists',
  'ISO-certified sterilization standards',
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Right-side tinted panel — solid, no gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] bg-slate-50 hidden lg:block" />
      {/* Subtle dot texture on right */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[48%] hidden lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.10) 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">

          {/* ── LEFT ── */}
          <div className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-10">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-teal-700 text-xs font-bold tracking-wide">
                Karachi&apos;s Highest Rated Dental Clinic
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.0] tracking-tight mb-6">
              <span className="text-slate-900">Your Smile,</span>
              <br />
              <span className="text-teal-600">Our Craft.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-500 text-xl leading-relaxed mb-10 max-w-[520px]">
              Painless, world-class dental care where every treatment is crafted with
              precision and artistry — from routine care to complete smile transformations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#appointment"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold text-base rounded-2xl hover:border-teal-200 hover:text-teal-700 hover:bg-teal-50 transition-all duration-200"
              >
                Explore Services
              </a>
            </div>

            {/* Inline stats row */}
            <div className="flex flex-wrap items-center pt-8 border-t border-slate-100">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex items-center">
                  <div className="px-5 py-2 first:pl-0">
                    <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
                    <p className="text-slate-400 text-xs font-semibold mt-1 whitespace-nowrap">{label}</p>
                  </div>
                  {i < STATS.length - 1 && <div className="w-px h-10 bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: CARD VISUAL ── */}
          <div className={`relative transition-all duration-1000 delay-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Main card */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-100">

              {/* Card header — solid teal, no gradient */}
              <div className="bg-teal-600 px-8 pt-10 pb-16 text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-teal-500/40" />
                <div className="absolute -bottom-4 -left-6 w-20 h-20 rounded-full bg-teal-700/40" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 rotate-12" />

                <div className="relative inline-flex w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 items-center justify-center mb-5">
                  <svg viewBox="0 0 80 100" className="w-10 h-12 text-white" fill="currentColor">
                    <path d="M40 4C24 4,6 18,6 38C6 58,18 65,22 80C26 95,28 100,33 100C38 100,40 88,40 88C40 88,42 100,47 100C52 100,54 95,58 80C62 65,74 58,74 38C74 18,56 4,40 4Z" />
                  </svg>
                </div>
                <h3 className="text-white font-black text-2xl">Anjum Dentist</h3>
                <p className="text-teal-200 text-sm font-medium mt-1">Est. 2009 · Clifton, Karachi</p>
              </div>

              {/* Card body — white */}
              <div className="bg-white px-8 pt-8 pb-8 -mt-6 rounded-t-3xl relative z-10">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-5">
                  Why Patients Choose Us
                </p>
                <div className="space-y-3.5">
                  {FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Appointment availability strip */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">Today&apos;s First Slot</p>
                    <p className="text-slate-900 font-black text-base mt-0.5">09:00 AM — Available</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-600 text-xs font-bold">Open</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: Rating */}
            <div className="absolute -top-6 -left-8 z-20 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/80 border border-slate-100 animate-float">
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-900 font-black text-xl leading-none">4.9 / 5</p>
              <p className="text-slate-400 text-xs font-medium mt-1">500+ Verified Reviews</p>
            </div>

            {/* Floating: Patients badge */}
            <div className="absolute -bottom-6 -right-5 z-20 bg-teal-600 rounded-2xl px-5 py-4 shadow-xl shadow-teal-600/25 animate-float-delayed">
              <p className="text-teal-100 text-xs font-semibold mb-0.5">Patients Served</p>
              <p className="text-white font-black text-xl leading-none">5,000+</p>
            </div>

            {/* Decorative ring */}
            <div className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full border-4 border-teal-100 -z-10" />
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <p className="text-slate-500 text-xs font-medium tracking-[0.2em] uppercase">Scroll</p>
        <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
      </div>
    </section>
  );
}
