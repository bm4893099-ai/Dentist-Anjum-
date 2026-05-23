'use client';

import { Stethoscope, Sparkles, Smile, Shield, Star, Heart, Baby, Crown, Scissors, Activity } from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'General Checkup & Cleaning',
    description: 'Comprehensive oral health examinations and professional deep cleaning to keep your smile healthy and bright.',
    color: 'from-teal-500 to-cyan-400',
    bg: 'from-teal-50 to-cyan-50',
    border: 'border-teal-100',
    tag: 'Most Popular',
  },
  {
    icon: Sparkles,
    title: 'Teeth Whitening',
    description: 'Advanced laser whitening treatments that deliver dramatic, long-lasting results in a single session.',
    color: 'from-amber-500 to-yellow-400',
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-100',
    tag: 'Specialist',
  },
  {
    icon: Activity,
    title: 'Orthodontics',
    description: 'Modern braces and clear aligners crafted to give you the perfectly straight smile you have always deserved.',
    color: 'from-violet-500 to-purple-400',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-100',
    tag: null,
  },
  {
    icon: Shield,
    title: 'Root Canal Treatment',
    description: 'Painless root canal procedures with numbing technology that save teeth and eliminate severe pain fast.',
    color: 'from-rose-500 to-pink-400',
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-100',
    tag: null,
  },
  {
    icon: Crown,
    title: 'Dental Implants',
    description: "Permanent, natural-looking dental implants that restore your smile's full function and aesthetics beautifully.",
    color: 'from-emerald-500 to-green-400',
    bg: 'from-emerald-50 to-green-50',
    border: 'border-emerald-100',
    tag: null,
  },
  {
    icon: Smile,
    title: 'Cosmetic Dentistry',
    description: 'Veneers, bonding, and complete smile makeovers to create the stunning smile you have always dreamed of.',
    color: 'from-cyan-500 to-sky-400',
    bg: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-100',
    tag: 'Trending',
  },
  {
    icon: Baby,
    title: 'Pediatric Dentistry',
    description: 'Gentle, fun and child-friendly dental care that builds healthy oral habits from the very earliest age.',
    color: 'from-orange-500 to-red-400',
    bg: 'from-orange-50 to-red-50',
    border: 'border-orange-100',
    tag: null,
  },
  {
    icon: Heart,
    title: 'Gum Treatment',
    description: 'Specialist periodontal therapies that prevent and treat gum disease, protecting the foundation of your smile.',
    color: 'from-teal-600 to-teal-400',
    bg: 'from-teal-50 to-teal-50',
    border: 'border-teal-100',
    tag: null,
  },
  {
    icon: Star,
    title: 'Dental Crown & Bridge',
    description: 'Custom-crafted crowns and bridges that restore damaged or missing teeth with perfect precision and durability.',
    color: 'from-indigo-500 to-blue-400',
    bg: 'from-indigo-50 to-blue-50',
    border: 'border-indigo-100',
    tag: null,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-slate-50">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-1.5 mb-5">
            <Star className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
            <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
            World-Class{' '}
            <span className="text-gradient-teal">Dental Services</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Comprehensive dental care tailored to every stage of life, powered by the latest technology and delivered with a gentle touch.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, description, color, bg, border, tag }) => (
            <div
              key={title}
              className="group relative bg-white rounded-3xl p-6 border border-slate-100 hover:border-teal-100 hover:-translate-y-1.5 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(13,148,136,0.10), 0 4px 16px rgba(0,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)'}
            >
              {/* Tag */}
              {tag && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700">
                    {tag}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${bg} border ${border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-slate-600 group-hover:text-teal-600 transition-colors duration-300" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight group-hover:text-teal-700 transition-colors duration-200">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>

              {/* Shimmer on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-teal-50/60 to-transparent pointer-events-none" />

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out rounded-b-3xl" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#appointment" className="btn-primary text-base px-8 py-4">
            Book Your Treatment Today
            <Scissors className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
