'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoVersion, setLogoVersion] = useState(1);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.logoVersion) setLogoVersion(d.data.logoVersion); })
      .catch(() => {});
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-slate-100 ${
          isScrolled ? 'shadow-md shadow-slate-200/60' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group" aria-label="Anjum Dentist Home">
              <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={`/logo.png?v=${logoVersion}`}
                  alt="Anjum Dentist Logo"
                  className="h-14 w-auto object-contain drop-shadow-sm"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                      isActive ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-teal-500 rounded-full transition-all duration-300 ${
                        isActive ? 'w-5' : 'w-0 group-hover:w-5'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="tel:+923001234567"
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">+92 300 1234567</span>
              </a>
              <a
                href="#appointment"
                className="group relative px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-0.5 hover:shadow-teal-600/30 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden"
              >
                <span className="relative z-10">Book Appointment</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-teal-50 transition-all duration-200"
            >
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/96 backdrop-blur-xl border-t border-teal-100 px-4 pb-6 pt-3 space-y-1 shadow-xl">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === href
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100">
              <a
                href="#appointment"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
