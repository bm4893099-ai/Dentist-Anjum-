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
      {/* Right-side tinted panel */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] bg-slate-50 hidden lg:block" />

      {/* Abstract geometric decorations on right panel */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] overflow-hidden hidden lg:block pointer-events-none">
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="1" fill="rgba(13,148,136,0.10)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        {/* Large concentric arcs — top right */}
        <svg className="absolute -top-16 -right-16 w-[400px] h-[400px] opacity-[0.04]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="180" stroke="#0d9488" strokeWidth="2"/>
          <circle cx="200" cy="200" r="140" stroke="#0d9488" strokeWidth="1.5"/>
          <circle cx="200" cy="200" r="100" stroke="#0d9488" strokeWidth="1"/>
          <circle cx="200" cy="200" r="60" stroke="#0d9488" strokeWidth="1"/>
        </svg>
        {/* Rounded rect — bottom left */}
        <svg className="absolute bottom-8 left-8 w-[220px] h-[220px] opacity-[0.045]" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="200" height="200" rx="50" stroke="#0d9488" strokeWidth="2"/>
          <rect x="35" y="35" width="150" height="150" rx="38" stroke="#0d9488" strokeWidth="1.5"/>
          <rect x="60" y="60" width="100" height="100" rx="26" stroke="#0d9488" strokeWidth="1"/>
        </svg>
        {/* Diagonal cross — mid right */}
        <svg className="absolute top-1/3 right-8 w-[80px] h-[80px] opacity-[0.06]" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40" x2="80" y2="40" stroke="#0d9488" strokeWidth="1.5"/>
          <line x1="40" y1="0" x2="40" y2="80" stroke="#0d9488" strokeWidth="1.5"/>
          <circle cx="40" cy="40" r="10" stroke="#0d9488" strokeWidth="1"/>
        </svg>
      </div>

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

            {/* Headline — luxury tight tracking */}
            <h1 className="text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[0.95] tracking-[-0.025em] mb-6">
              <span className="text-slate-900 block">Your Smile,</span>
              <span className="text-teal-600 block mt-1">Our Craft.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-500 text-xl leading-relaxed mb-10 max-w-[520px] font-light tracking-[0.01em]">
              Painless, world-class dental care where every treatment is crafted with
              precision and artistry — from routine care to complete smile transformations.
            </p>

            {/* CTA Buttons — shimmer on hover */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#appointment"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-600/30 transition-all duration-300 ease-in-out overflow-hidden"
              >
                <span className="relative z-10">Book Free Consultation</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 ease-in-out" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </a>
              <a
                href="#services"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold text-base rounded-2xl hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
              >
                Explore Services
              </a>
            </div>

            {/* Stats row — hover micro-interactions */}
            <div className="flex flex-wrap items-center pt-8 border-t border-slate-100">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex items-center">
                  <div className="group px-5 py-2 first:pl-0 cursor-default">
                    <p className="text-2xl font-black text-slate-900 leading-none tracking-tight group-hover:text-teal-600 transition-colors duration-300">{value}</p>
                    <p className="text-slate-400 text-xs font-semibold mt-1 whitespace-nowrap group-hover:text-slate-500 transition-colors duration-300">{label}</p>
                  </div>
                  {i < STATS.length - 1 && <div className="w-px h-10 bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: CARD VISUAL ── */}
          <div className={`relative transition-all duration-1000 delay-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Main card — layered glassmorphism shadow */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.12),0_8px_24px_-4px_rgba(0,0,0,0.06),0_0_0_1px_rgba(226,232,240,0.7)] border border-white/60">

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

              {/* Card body — glassmorphism */}
              <div className="bg-white/90 backdrop-blur-xl px-8 pt-8 pb-8 -mt-6 rounded-t-3xl relative z-10">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-5">
                  Why Patients Choose Us
                </p>
                <div className="space-y-2">
                  {FEATURES.map((f) => (
                    <div key={f} className="group flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-teal-50/70 transition-all duration-200 ease-in-out cursor-default">
                      <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 group-hover:border-teal-300 group-hover:scale-110 transition-all duration-200">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors duration-200">{f}</span>
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

            {/* Floating: Rating — glassmorphism */}
            <div className="absolute -top-6 -left-8 z-20 bg-white/80 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_60px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.85)] border border-white/70 animate-float hover:scale-105 transition-transform duration-300 cursor-default">
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-900 font-black text-xl leading-none">4.9 / 5</p>
              <p className="text-slate-400 text-xs font-medium mt-1">500+ Verified Reviews</p>
            </div>

            {/* Floating: Patients badge */}
            <div className="absolute -bottom-6 -right-5 z-20 bg-teal-600 rounded-2xl px-5 py-4 shadow-[0_20px_60px_-8px_rgba(13,148,136,0.4)] animate-float-delayed hover:scale-105 hover:bg-teal-700 transition-all duration-300 cursor-default">
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
