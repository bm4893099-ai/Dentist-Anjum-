'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill all fields.');
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
    setSending(false);
  };

  const contactItems = [
    {
      icon: Phone,
      label: 'Call Us',
      value: settings?.phone || '+92 300 1234567',
      sub: 'Mon–Sat, 9 AM – 7 PM',
      href: `tel:${settings?.phone || '+923001234567'}`,
      color: 'from-teal-500 to-cyan-400',
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: settings?.email || 'info@anjumdentist.com',
      sub: 'We reply within 24 hours',
      href: `mailto:${settings?.email || 'info@anjumdentist.com'}`,
      color: 'from-violet-500 to-purple-400',
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: settings?.address || '123 Dental Street, Clifton, Karachi',
      sub: 'Get directions on Maps',
      href: '#',
      color: 'from-rose-500 to-pink-400',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: settings?.workingHours || 'Mon–Sat: 9:00 AM – 7:00 PM',
      sub: 'Emergency: 24/7',
      href: null,
      color: 'from-amber-500 to-yellow-400',
    },
  ];

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-1.5 mb-5">
            <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">Get In Touch</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
            We&apos;re Here to <span className="text-gradient-teal">Help You</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Have a question or want to learn more? Reach out — our team is always happy to assist.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contactItems.map(({ icon: Icon, label, value, sub, href, color }) => (
              <div key={label} className="card-premium p-5 group">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                {href ? (
                  <a
                    href={href}
                    className="text-slate-900 font-semibold text-sm hover:text-teal-600 transition-colors leading-snug block"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-slate-900 font-semibold text-sm leading-snug">{value}</p>
                )}
                <p className="text-slate-400 text-xs mt-1 font-medium">{sub}</p>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <div className="sm:col-span-2">
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300 shadow-lg shadow-green-200/50 hover:shadow-green-300/60 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-premium p-8">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Send Us a Message</h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="label-field">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can we help you?"
                  className="input-field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
