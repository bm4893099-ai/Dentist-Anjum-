'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2, Calendar, Clock, CheckCircle, ScanLine, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const ROLE_COLORS = {
  Dentist: 'bg-purple-50 text-purple-700 border-purple-200',
  Manager: 'bg-blue-50 text-blue-700 border-blue-200',
  Receptionist: 'bg-teal-50 text-teal-700 border-teal-200',
  Assistant: 'bg-amber-50 text-amber-700 border-amber-200',
  Cleaner: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_COLORS = {
  Present: 'bg-green-50 text-green-700 border-green-200',
  Late: 'bg-amber-50 text-amber-700 border-amber-200',
  Absent: 'bg-red-50 text-red-600 border-red-200',
};

export default function StaffPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [meRes, attRes] = await Promise.all([
          fetch('/api/staff/me'),
          fetch('/api/attendance/mine'),
        ]);
        const meData = await meRes.json();
        const attData = await attRes.json();
        if (!meData.success) { router.replace('/user/login'); return; }
        setUser(meData.data);
        if (attData.success) {
          setAttendance(attData.data);
          const today = new Date().toISOString().split('T')[0];
          setTodayRecord(attData.data.find(r => r.date === today) || null);
        }
      } catch {
        router.replace('/user/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch('/api/staff/logout', { method: 'POST' }); }
    finally { router.push('/user/login'); router.refresh(); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-teal-800" />
    </div>
  );

  const today = new Date().toISOString().split('T')[0];
  const presentDays = attendance.filter(r => r.status !== 'Absent').length;
  const lateDays = attendance.filter(r => r.status === 'Late').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/api/logo" alt="Anjum Dentist" className="w-9 h-9 object-contain" />
            <div>
              <p className="text-slate-900 font-black text-sm leading-none">Anjum Dentist</p>
              <p className="text-teal-800 text-[10px] font-bold uppercase tracking-widest mt-0.5">Staff Portal</p>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all">
            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
              <span className="text-teal-800 font-black text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-slate-900 font-black text-xl tracking-tight">{user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.phone}</p>
              <span className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-lg border ${ROLE_COLORS[user?.role] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className={`border rounded-2xl p-5 shadow-sm ${todayRecord ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-800" />
              <p className="font-black text-slate-900 text-sm">Today&apos;s Attendance</p>
            </div>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
          </div>
          {todayRecord ? (
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-black text-green-700">Attendance Marked</p>
                <p className="text-green-600 text-sm">Checked in at {todayRecord.checkIn} · <span className={`font-bold`}>{todayRecord.status}</span></p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-3 gap-3">
              <p className="text-slate-500 text-sm">Not marked yet for today.</p>
              <a
                href="/user/scan"
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all"
              >
                <QrCode className="w-4 h-4" /> Scan QR to Mark Attendance
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Days Present', value: presentDays, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Late Days', value: lateDays, icon: Clock, color: 'text-amber-600' },
            { label: 'Total Records', value: attendance.length, icon: Calendar, color: 'text-teal-800' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Attendance History */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-sm">Attendance History</h3>
          </div>
          {attendance.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No records yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {attendance.slice(0, 20).map(r => (
                <div key={r._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{r.date}</p>
                    <p className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{r.checkIn || '—'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
