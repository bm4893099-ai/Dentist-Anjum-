'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, Calendar, Users, Star } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Login failed. Please check your credentials.');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07101f] flex overflow-hidden">

      {/* ── LEFT BRANDING PANEL ── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-[#0a1628] to-[#07101f]" />
        <div className="absolute top-0 -left-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Top: logo + brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <Image src="/logo.png" alt="Anjum Dentist" width={52} height={52} className="w-13 h-13 object-contain drop-shadow-lg" />
            <div>
              <p className="text-white font-black text-lg leading-none tracking-tight">Anjum Dentist</p>
              <p className="text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Admin Portal</p>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
            Manage your<br />
            <span className="text-teal-400">clinic,</span><br />
            effortlessly.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Full control over appointments, patient contacts, and all website settings — in one secure place.
          </p>
        </div>
        {/* Bottom: stats */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { icon: Users, value: '5,000+', label: 'Patients Served' },
            { icon: Calendar, value: '15+', label: 'Years Active' },
            { icon: Star, value: '98%', label: 'Satisfaction' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-sm">
              <Icon className="w-4.5 h-4.5 text-teal-400 mx-auto mb-2" size={18} />
              <p className="text-white font-black text-xl tracking-tight">{value}</p>
              <p className="text-slate-500 text-[11px] font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-[#07101f]" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-teal-700/5 rounded-full blur-3xl" />

        <div className="relative w-full max-w-[420px]">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <Image src="/logo.png" alt="Anjum Dentist" width={48} height={48} className="w-12 h-12 object-contain" />
            <div>
              <p className="text-white font-black text-xl tracking-tight">Anjum Dentist</p>
              <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/60">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/30">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-xl leading-none tracking-tight">Secure Sign In</h2>
                <p className="text-slate-500 text-xs font-medium mt-1">Restricted to authorised personnel only</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="admin"
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-200 text-sm font-medium"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-200 text-sm font-medium"
                    style={{ colorScheme: 'dark' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full flex items-center justify-center gap-2.5 py-4 mt-1 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/20 hover:-translate-y-0.5 hover:shadow-teal-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Sign In to Dashboard</>
                )}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-slate-600 text-xs">Unauthorised access attempts are logged and monitored.</p>
            </div>
          </div>

          <p className="text-center text-slate-700 text-xs mt-6">
            © {new Date().getFullYear()} Anjum Dentist · Secure Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
