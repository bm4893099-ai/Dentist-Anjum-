'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Loader2, UserCheck, Calendar, Clock, Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Present: 'bg-green-50 text-green-700 border-green-200',
  Late: 'bg-amber-50 text-amber-700 border-amber-200',
  Absent: 'bg-red-50 text-red-600 border-red-200',
};

export default function AttendanceTab() {
  const [qrImage, setQrImage] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [qrDate, setQrDate] = useState('');
  const [qrLoading, setQrLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [manualModal, setManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({ userId: '', status: 'Present' });
  const [manualSaving, setManualSaving] = useState(false);
  const timerRef = useRef(null);

  const loadQR = useCallback(async () => {
    setQrLoading(true);
    try {
      const r = await fetch('/api/attendance/qr');
      const d = await r.json();
      if (!d.success) throw new Error(d.error);
      setQrToken(d.token);
      setQrDate(d.date);
      const QRCode = (await import('qrcode')).default;
      const url = await QRCode.toDataURL(d.qrContent, { width: 260, margin: 2, color: { dark: '#0f5c55', light: '#ffffff' } });
      setQrImage(url);
    } catch { toast.error('Failed to generate QR.'); }
    finally { setQrLoading(false); }
  }, []);

  const loadRecords = useCallback(async () => {
    setRecLoading(true);
    try {
      const r = await fetch(`/api/attendance?date=${selectedDate}`);
      const d = await r.json();
      if (d.success) setRecords(d.data);
    } catch { toast.error('Failed to load attendance.'); }
    finally { setRecLoading(false); }
  }, [selectedDate]);

  const loadUsers = useCallback(async () => {
    try {
      const r = await fetch('/api/staff/users');
      const d = await r.json();
      if (d.success) setUsers(d.data);
    } catch {}
  }, []);

  useEffect(() => {
    loadQR();
    loadUsers();
    timerRef.current = setInterval(loadQR, 2 * 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, [loadQR, loadUsers]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const handleManualAdd = async () => {
    if (!manualForm.userId) return toast.error('Select a staff member.');
    const user = users.find(u => u._id === manualForm.userId);
    if (!user) return;
    setManualSaving(true);
    try {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = String(now.getMinutes()).padStart(2, '0');
      const p = now.getHours() >= 12 ? 'PM' : 'AM';
      const checkIn = `${String(h).padStart(2, '0')}:${m} ${p}`;
      const r = await fetch('/api/attendance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, userName: user.name, userPhone: user.phone, date: selectedDate, token: qrToken, status: manualForm.status, method: 'Manual', checkIn }),
      });
      const d = await r.json();
      if (d.success) { toast.success('Attendance marked!'); setManualModal(false); loadRecords(); }
      else toast.error(d.error || 'Failed.');
    } catch { toast.error('Network error.'); }
    finally { setManualSaving(false); }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Attendance</h2>
          <p className="text-slate-500 text-sm mt-0.5">Daily QR-based staff attendance tracking</p>
        </div>
        <button onClick={() => setManualModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Manual Entry
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* QR Code Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-slate-900">Today&apos;s QR Code</h3>
                <p className="text-xs text-slate-400 mt-0.5">Auto-refreshes every 2 min</p>
              </div>
              <button onClick={loadQR} disabled={qrLoading} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-teal-50 hover:text-teal-800 transition-all disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${qrLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {qrLoading ? (
              <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-800" />
              </div>
            ) : qrImage ? (
              <div className="bg-white border-2 border-teal-800/10 rounded-2xl p-3 inline-block">
                <img src={qrImage} alt="Attendance QR" className="w-full max-w-[220px]" />
              </div>
            ) : (
              <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-sm">QR unavailable</div>
            )}

            <div className="mt-4 space-y-2">
              <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-teal-600 font-semibold">Date: {qrDate}</p>
              </div>
              <p className="text-xs text-slate-400">Staff scan this QR from their user panel to mark attendance</p>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-teal-800" />
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="text-sm font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-800" />
                {isToday && <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">Today</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="font-bold text-slate-900">{records.filter(r => r.status !== 'Absent').length}</span> present
              </div>
            </div>

            {recLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-teal-800" /> Loading...
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Clock className="w-10 h-10 mb-3 opacity-20" />
                <p className="font-semibold">No attendance records for this date.</p>
                <p className="text-xs mt-1">Staff can scan the QR code to mark their attendance.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider">Staff</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider">Check In</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider">Method</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map(r => (
                    <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{r.userName}</p>
                        <p className="text-xs text-slate-400">{r.userPhone}</p>
                      </td>
                      <td className="px-5 py-4 font-mono text-sm text-slate-700">{r.checkIn || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${r.method === 'QR' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>{r.method}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {manualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setManualModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900">Manual Attendance</h3>
              <button onClick={() => setManualModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Member</label>
                <select value={manualForm.userId} onChange={e => setManualForm(p => ({ ...p, userId: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all">
                  <option value="">Select staff...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} — {u.role}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                <select value={manualForm.status} onChange={e => setManualForm(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all">
                  <option>Present</option><option>Late</option><option>Absent</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setManualModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={handleManualAdd} disabled={manualSaving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl disabled:opacity-60">
                {manualSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Mark Attendance</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
