'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Appointment', href: '#appointment' },
];

const serviceLinks = [
  'General Checkup',
  'Teeth Whitening',
  'Orthodontics',
  'Root Canal',
  'Dental Implants',
  'Cosmetic Dentistry',
];

const DEFAULT = {
  phone: '+92 300 1234567',
  email: 'info@anjumdentist.com',
  address: '123 Dental Street, Clifton, Karachi, Pakistan',
  footerCopyright: '© 2024 Anjum Dentist. All Rights Reserved.',
  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#',
};

export default function Footer() {
  const [settings, setSettings] = useState(DEFAULT);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.data); })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top CTA strip */}
      <div className="bg-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">
              Ready for a Healthier Smile?
            </h3>
            <p className="text-teal-100 text-sm">
              Book a free consultation today. No commitment required.
            </p>
          </div>
          <a
            href="#appointment"
            className="flex-shrink-0 px-8 py-3.5 bg-white text-teal-700 font-bold rounded-2xl shadow-lg hover:bg-teal-50 hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Free Consultation
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-extrabold text-xl leading-none">
                  Anjum <span className="text-teal-400">Dentist</span>
                </p>
                <p className="text-slate-500 text-[10px] font-semibold tracking-widest uppercase mt-0.5">
                  Dental Clinic &middot; Karachi
                </p>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Delivering world-class, painless dental care in Karachi for over 15 years.
              Your smile is our mission.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: settings.facebookUrl, label: 'Facebook' },
                { icon: Instagram, href: settings.instagramUrl, label: 'Instagram' },
                { icon: Twitter, href: settings.twitterUrl, label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href || '#'}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-400 text-sm hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 group-hover:bg-teal-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-slate-400 text-sm hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 group-hover:bg-teal-400 transition-colors" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-600/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-teal-600 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-teal-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Phone</p>
                    <p className="text-slate-300 text-sm font-medium group-hover:text-teal-400 transition-colors">
                      {settings.phone}
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-600/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-teal-600 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-teal-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Email</p>
                    <p className="text-slate-300 text-sm font-medium group-hover:text-teal-400 transition-colors">
                      {settings.email}
                    </p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Address</p>
                  <p className="text-slate-300 text-sm font-medium leading-snug">
                    {settings.address}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">{settings.footerCopyright}</p>
          <p className="text-slate-500 text-xs flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> in Karachi, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
