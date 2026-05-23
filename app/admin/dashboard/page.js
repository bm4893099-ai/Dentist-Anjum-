'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope, LogOut, Users, Settings, RefreshCw, Trash2,
  CheckCircle, Clock, XCircle, LayoutDashboard, Loader2,
  Save, Phone, Mail, MapPin, AlertCircle, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  Pending:   { dot: 'bg-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50   border-amber-200'  },
  Confirmed: { dot: 'bg-teal-400',    text: 'text-teal-700',    bg: 'bg-teal-50    border-teal-200'   },
  Completed: { dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200'},
  Cancelled: { dot: 'bg-red-400',     text: 'text-red-600',     bg: 'bg-red-50     border-red-200'    },
};

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const DEFAULT_SETTINGS = {
  phone: '', email: '', address: '', footerCopyright: '',
  facebookUrl: '', instagramUrl: '', twitterUrl: '', whatsappNumber: '', workingHours: '',
};

/* ── STATUS BADGE ──────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

/* ── APPOINTMENTS TAB ──────────────────────── */
function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success) setAppointments(data.data);
      else toast.error('Failed to fetch appointments.');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id, status) => {
    setUpdating((p) => ({ ...p, [id]: 'updating' }));
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
        toast.success(`Status updated to ${status}.`);
      } else {
        toast.error(data.error || 'Update failed.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setUpdating((p) => ({ ...p, [id]: null }));
    }
  };

  const deleteAppointment = async (id, name) => {
    if (!confirm(`Delete appointment for "${name}"? This cannot be undone.`)) return;
    setUpdating((p) => ({ ...p, [id]: 'deleting' }));
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        toast.success('Appointment deleted.');
      } else {
        toast.error(data.error || 'Delete failed.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setUpdating((p) => ({ ...p, [id]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
        <p className="font-medium">Loading appointments...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="font-semibold text-lg">No appointments yet.</p>
        <p className="text-sm mt-1">Appointments will appear here once patients book.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">All Appointments</h2>
          <p className="text-slate-400 text-sm mt-0.5">{appointments.length} total records</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATUSES.map((s) => {
          const count = appointments.filter((a) => a.status === s).length;
          const st = STATUS_STYLES[s];
          return (
            <div key={s} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{s}</span>
              </div>
              <p className="text-3xl font-black text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700">
              {['Patient', 'Phone', 'Service', 'Date & Time', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-slate-400 font-bold text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {appointments.map((apt) => {
              const busy = updating[apt._id];
              return (
                <tr key={apt._id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Patient */}
                  <td className="px-4 py-4">
                    <p className="font-bold text-white">{apt.fullName}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{apt.email}</p>
                  </td>
                  {/* Phone */}
                  <td className="px-4 py-4 text-slate-300 font-medium">{apt.phone}</td>
                  {/* Service */}
                  <td className="px-4 py-4">
                    <span className="inline-block bg-teal-900/50 border border-teal-700/50 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-lg max-w-[150px] truncate">
                      {apt.serviceType}
                    </span>
                  </td>
                  {/* Date & Time */}
                  <td className="px-4 py-4">
                    <p className="text-slate-200 font-semibold">{apt.preferredDate}</p>
                    <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{apt.preferredTime}
                    </p>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4">
                    <div className="relative">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt._id, e.target.value)}
                        disabled={!!busy}
                        className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50 cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-slate-800">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatus(apt._id, 'Confirmed')}
                        disabled={!!busy || apt.status === 'Confirmed'}
                        title="Confirm"
                        className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-600/40 text-teal-400 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {busy === 'updating' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteAppointment(apt._id, apt.fullName)}
                        disabled={!!busy}
                        title="Delete"
                        className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {busy === 'deleting' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── SETTINGS TAB ──────────────────────────── */
function SettingsTab() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.data); })
      .catch(() => toast.error('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Settings saved! Changes are live on the website.');
      } else {
        toast.error(data.error || 'Save failed.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
        Loading settings...
      </div>
    );
  }

  const fieldGroups = [
    {
      title: 'Contact Information',
      icon: Phone,
      fields: [
        { label: 'Phone Number', name: 'phone', type: 'text', placeholder: '+92 300 1234567', icon: Phone },
        { label: 'Email Address', name: 'email', type: 'email', placeholder: 'info@anjumdentist.com', icon: Mail },
        { label: 'Clinic Address', name: 'address', type: 'text', placeholder: '123 Dental Street, Karachi', icon: MapPin },
        { label: 'WhatsApp Number', name: 'whatsappNumber', type: 'text', placeholder: '+923001234567', icon: Phone },
        { label: 'Working Hours', name: 'workingHours', type: 'text', placeholder: 'Mon–Sat: 9:00 AM – 7:00 PM', icon: Clock },
      ],
    },
    {
      title: 'Social Media Links',
      icon: Settings,
      fields: [
        { label: 'Facebook URL', name: 'facebookUrl', type: 'url', placeholder: 'https://facebook.com/...', icon: Settings },
        { label: 'Instagram URL', name: 'instagramUrl', type: 'url', placeholder: 'https://instagram.com/...', icon: Settings },
        { label: 'Twitter URL', name: 'twitterUrl', type: 'url', placeholder: 'https://twitter.com/...', icon: Settings },
      ],
    },
    {
      title: 'Footer Content',
      icon: LayoutDashboard,
      fields: [
        { label: 'Footer Copyright Text', name: 'footerCopyright', type: 'text', placeholder: '© 2024 Anjum Dentist. All Rights Reserved.', icon: LayoutDashboard },
      ],
    },
  ];

  return (
    <form onSubmit={handleSave}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Site Settings</h2>
          <p className="text-slate-400 text-sm mt-0.5">Changes go live immediately on the website</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 flex items-start gap-3 mb-8">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-200 text-sm font-medium">
          These settings control the live website&apos;s footer, contact section, and social links.
          Save carefully.
        </p>
      </div>

      <div className="space-y-8">
        {fieldGroups.map(({ title, icon: GroupIcon, fields }) => (
          <div key={title} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-teal-600/20 border border-teal-600/40 flex items-center justify-center">
                <GroupIcon className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-white font-bold">{title}</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map(({ label, name, type, placeholder }) => (
                <div key={name} className={name === 'address' || name === 'footerCopyright' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={settings[name] || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all duration-200 text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Settings</>
          )}
        </button>
      </div>
    </form>
  );
}

/* ── MAIN DASHBOARD ────────────────────────── */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState('appointments');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Users },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Bar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-4.5 h-4.5 text-white" size={18} />
              </div>
              <div>
                <p className="text-white font-black text-base leading-none">Anjum Dentist</p>
                <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 gap-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tab === id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-semibold disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="sm:hidden flex border-b border-slate-800 bg-slate-900">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              tab === id
                ? 'text-teal-400 border-b-2 border-teal-500'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <LayoutDashboard className="w-5 h-5 text-teal-400" />
          <div>
            <p className="text-white font-bold">Welcome back, Admin</p>
            <p className="text-slate-400 text-xs">Anjum Dentist management dashboard</p>
          </div>
        </div>

        {tab === 'appointments' && <AppointmentsTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}
