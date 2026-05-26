'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LogOut, Users, Settings, RefreshCw, Trash2,
  CheckCircle, Clock, LayoutDashboard, Loader2,
  Save, Phone, Mail, MapPin, AlertCircle, ChevronDown,
  Menu, X, TrendingUp, Calendar, Search, ExternalLink,
  Stethoscope, FileText, UserCog, ScanLine,
} from 'lucide-react';
import toast from 'react-hot-toast';
import TreatmentsTab from '@/components/admin/TreatmentsTab';
import PatientsTab from '@/components/admin/PatientsTab';
import StaffUsersTab from '@/components/admin/StaffUsersTab';
import AttendanceTab from '@/components/admin/AttendanceTab';

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
  const [search, setSearch] = useState('');

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
        setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
        toast.success(`Status updated to ${status}.`);
      } else toast.error(data.error || 'Update failed.');
    } catch { toast.error('Network error.'); }
    finally { setUpdating((p) => ({ ...p, [id]: null })); }
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
      } else toast.error(data.error || 'Delete failed.');
    } catch { toast.error('Network error.'); }
    finally { setUpdating((p) => ({ ...p, [id]: null })); }
  };

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    return !q || a.fullName?.toLowerCase().includes(q) || a.phone?.includes(q) || a.email?.toLowerCase().includes(q) || a.serviceType?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-28 text-slate-500">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
      <p className="font-semibold">Loading appointments...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Appointments</h2>
          <p className="text-slate-500 text-sm mt-0.5">{appointments.length} total bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-56 shadow-sm"
            />
          </div>
          <button onClick={fetchAppointments} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-teal-600 hover:border-teal-600 hover:text-white transition-all text-sm font-semibold shadow-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {STATUSES.map((s) => {
          const count = appointments.filter((a) => a.status === s).length;
          const st = STATUS_STYLES[s];
          return (
            <div key={s} className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-teal-200 hover:shadow-md transition-all shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
              </div>
              <p className="text-4xl font-black text-slate-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Users className="w-12 h-12 mb-4 opacity-20" />
          <p className="font-semibold text-lg">{search ? 'No results found.' : 'No appointments yet.'}</p>
          <p className="text-sm mt-1">{search ? 'Try a different search term.' : 'Bookings will appear here once patients submit the form.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Patient & Email', 'Phone', 'Service', 'Date & Time', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-4 text-slate-500 font-bold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((apt) => {
                const busy = updating[apt._id];
                return (
                  <tr key={apt._id} className="hover:bg-teal-50/40 transition-colors group">
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900">{apt.fullName}</p>
                      {apt.email && (
                        <a href={`mailto:${apt.email}`} className="text-slate-500 text-xs mt-0.5 flex items-center gap-1 hover:text-teal-400 transition-colors">
                          <Mail className="w-3 h-3" />{apt.email}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <a href={`tel:${apt.phone}`} className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-600 hover:border-teal-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all group/phone">
                        <Phone className="w-3 h-3" />{apt.phone}
                        <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/phone:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg max-w-[160px] truncate">{apt.serviceType}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-800 font-bold text-xs">{apt.preferredDate}</p>
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{apt.preferredTime}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select
                          value={apt.status}
                          onChange={(e) => updateStatus(apt._id, e.target.value)}
                          disabled={!!busy}
                          className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateStatus(apt._id, 'Confirmed')} disabled={!!busy || apt.status === 'Confirmed'} title="Confirm" className="w-8 h-8 rounded-xl bg-teal-600/15 border border-teal-600/30 text-teal-400 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          {busy === 'updating' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => deleteAppointment(apt._id, apt.fullName)} disabled={!!busy} title="Delete" className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-600/30 text-red-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          {busy === 'deleting' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── SETTINGS TAB ──────────────────────────── */
function SettingsTab({ onLogoUpdated, onFaviconUpdated }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoKey, setLogoKey] = useState(0);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [faviconKey, setFaviconKey] = useState(0);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings(d.data);
        }
      })
      .catch(() => toast.error('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((p) => ({ ...p, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async () => {
    if (!logoPreview) return;
    setLogoUploading(true);
    try {
      const res = await fetch('/api/settings/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: logoPreview }),
      });
      const data = await res.json();
      if (data.success) {
        setLogoPreview(null);
        setLogoKey(k => k + 1);
        onLogoUpdated?.();
        toast.success('Logo updated successfully!');
      } else throw new Error(data.error);
    } catch (err) {
      toast.error(err.message || 'Logo upload failed.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFaviconPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = async () => {
    if (!faviconPreview) return;
    setFaviconUploading(true);
    try {
      const res = await fetch('/api/settings/favicon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: faviconPreview }),
      });
      const data = await res.json();
      if (data.success) {
        setFaviconPreview(null);
        setFaviconKey(k => k + 1);
        onFaviconUpdated?.();
        toast.success('Favicon updated successfully!');
      } else throw new Error(data.error);
    } catch (err) {
      toast.error(err.message || 'Favicon upload failed.');
    } finally {
      setFaviconUploading(false);
    }
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
          <h2 className="text-xl font-black text-slate-900">Site Settings</h2>
          <p className="text-slate-500 text-sm mt-0.5">Changes go live immediately on the website</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-8">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-amber-700 text-sm font-medium">
          These settings control the live website&apos;s footer, contact section, and social links.
          Save carefully.
        </p>
      </div>

      {/* ── LOGO UPLOAD ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center overflow-hidden">
            <img key={logoKey} src="/api/logo" alt="logo" className="w-5 h-5 object-contain" />
          </div>
          <h3 className="text-slate-900 font-bold">Clinic Logo</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Appears on website &amp; admin panel</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoPreview
              ? <img src={logoPreview} alt="preview" className="w-full h-full object-contain p-1" />
              : <img key={logoKey} src="/api/logo" alt="current" className="w-full h-full object-contain p-2" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 mb-1">Upload new logo</p>
            <p className="text-xs text-slate-400 mb-3">PNG or JPG recommended. Replaces the logo on the website and admin panel instantly.</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
                Choose File
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
              {logoPreview && (
                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={logoUploading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  {logoUploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</> : <><Save className="w-3.5 h-3.5" /> Save Logo</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FAVICON UPLOAD ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            <img key={faviconKey} src="/api/favicon-icon" alt="favicon" className="w-5 h-5 object-contain" onError={e => { e.target.style.display='none'; }} />
          </div>
          <h3 className="text-slate-900 font-bold">Favicon</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Browser tab icon</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {faviconPreview
              ? <img src={faviconPreview} alt="preview" className="w-full h-full object-contain p-1" />
              : <img key={faviconKey} src="/api/favicon-icon" alt="current" className="w-full h-full object-contain p-1" onError={e => { e.target.style.display='none'; }} />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 mb-1">Upload favicon</p>
            <p className="text-xs text-slate-400 mb-3">PNG or ICO recommended. Displays in browser tabs and bookmarks. Best size: 32×32 or 64×64 px.</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
                Choose File
                <input type="file" accept="image/*,.ico" onChange={handleFaviconChange} className="hidden" />
              </label>
              {faviconPreview && (
                <button
                  type="button"
                  onClick={handleFaviconUpload}
                  disabled={faviconUploading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  {faviconUploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</> : <><Save className="w-3.5 h-3.5" /> Save Favicon</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {fieldGroups.map(({ title, icon: GroupIcon, fields }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                <GroupIcon className="w-4 h-4 text-teal-800" />
              </div>
              <h3 className="text-slate-900 font-bold">{title}</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map(({ label, name, type, placeholder }) => (
                <div key={name} className={name === 'address' || name === 'footerCopyright' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={settings[name] || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-800/15 focus:border-teal-800 transition-all duration-200 text-sm"
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
          className="flex items-center gap-2.5 px-8 py-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-2xl shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoKey, setLogoKey] = useState(0);
  const [faviconKey, setFaviconKey] = useState(0);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch('/api/auth/logout', { method: 'POST' }); }
    finally { router.push('/admin/login'); router.refresh(); }
  };

  const navItems = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'treatments', label: 'Treatments', icon: Stethoscope },
    { id: 'patients', label: 'Patients & Invoices', icon: FileText },
    { id: 'staff', label: 'Staff Users', icon: UserCog },
    { id: 'attendance', label: 'Attendance', icon: ScanLine },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img key={logoKey} src="/api/logo" alt="Anjum Dentist" className="w-11 h-11 object-contain drop-shadow" />
          <div>
            <p className="text-slate-900 font-black text-base leading-none tracking-tight">Anjum Dentist</p>
            <p className="text-teal-600 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Management</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              tab === id
                ? 'bg-teal-800 text-white shadow-lg shadow-teal-800/20'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
        >
          {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen shadow-sm">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white border-r border-slate-200 flex flex-col h-full z-10">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 gap-4 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-slate-900 font-black tracking-tight capitalize">
              {{ appointments: 'Appointments', treatments: 'Treatments', patients: 'Patients & Invoices', staff: 'Staff Users', attendance: 'Attendance', settings: 'Site Settings' }[tab]}
            </h1>
            <p className="text-slate-400 text-xs hidden sm:block">
              {{ appointments: 'View and manage all patient bookings', treatments: 'Add and manage dental treatments with pricing', patients: 'Patient files and professional invoices', staff: 'Manage staff logins and access', attendance: 'QR-based daily attendance tracking', settings: 'Control website content and contact details' }[tab]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-slate-900 text-sm font-bold leading-none">Admin</p>
              <p className="text-slate-400 text-xs mt-0.5">Anjum Dentist</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {tab === 'appointments' && <AppointmentsTab />}
          {tab === 'treatments' && <TreatmentsTab />}
          {tab === 'patients' && <PatientsTab />}
          {tab === 'staff' && <StaffUsersTab />}
          {tab === 'attendance' && <AttendanceTab />}
          {tab === 'settings' && <SettingsTab onLogoUpdated={() => setLogoKey(k => k + 1)} onFaviconUpdated={() => setFaviconKey(k => k + 1)} />}
        </main>
      </div>
    </div>
  );
}
