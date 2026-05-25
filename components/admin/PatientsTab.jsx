'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Printer, Trash2, X, Loader2, FileText, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', phone: '', email: '', treatmentName: '', sessionCount: 1, pricePerSession: 0, totalAmount: 0, discount: 0, discountType: '%', finalAmount: 0, notes: '', status: 'Active' };

function calcFinal(total, discount, discountType) {
  const d = parseFloat(discount) || 0;
  const t = parseFloat(total) || 0;
  if (discountType === '%') return Math.max(0, t - (t * d / 100));
  return Math.max(0, t - d);
}

export default function PatientsTab() {
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [invoicePatient, setInvoicePatient] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [clinicSettings, setClinicSettings] = useState({ phone: '', address: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, tr, sr] = await Promise.all([
        fetch('/api/patients').then(r => r.json()),
        fetch('/api/treatments').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
      ]);
      if (pr.success) setPatients(pr.data);
      if (tr.success) setTreatments(tr.data);
      if (sr.success) setClinicSettings(sr.data);
    } catch { toast.error('Failed to load data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFormChange = (key, val) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'treatmentName') {
        const t = treatments.find(t => t.name === val);
        if (t) {
          const pkg = t.sessionPackages?.find(p => p.sessions === Number(next.sessionCount));
          const pps = pkg ? pkg.price / pkg.sessions : t.basePrice;
          next.pricePerSession = pps;
          next.totalAmount = pps * next.sessionCount;
        }
      }
      if (key === 'sessionCount') {
        const t = treatments.find(t => t.name === next.treatmentName);
        if (t) {
          const pkg = t.sessionPackages?.find(p => p.sessions === Number(val));
          const pps = pkg ? pkg.price / pkg.sessions : t.basePrice;
          next.pricePerSession = pps;
          next.totalAmount = pps * Number(val);
        } else {
          next.totalAmount = next.pricePerSession * Number(val);
        }
      }
      if (key === 'pricePerSession') next.totalAmount = Number(val) * next.sessionCount;
      if (key === 'totalAmount' || key === 'pricePerSession') {}
      next.finalAmount = calcFinal(next.totalAmount, next.discount, next.discountType);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) return toast.error('Name and phone are required.');
    setSaving(true);
    try {
      const r = await fetch('/api/patients', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sessionCount: Number(form.sessionCount), pricePerSession: Number(form.pricePerSession), totalAmount: Number(form.totalAmount), discount: Number(form.discount), finalAmount: Number(form.finalAmount) }),
      });
      const d = await r.json();
      if (d.success) { toast.success('Patient file created!'); setModal(false); setForm(EMPTY_FORM); load(); }
      else toast.error(d.error || 'Failed.');
    } catch { toast.error('Network error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete patient "${name}"?`)) return;
    setDeleting(id);
    try { await fetch(`/api/patients/${id}`, { method: 'DELETE' }); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
    finally { setDeleting(null); }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    (p.invoiceNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  const STATUS_COLORS = { Active: 'bg-blue-50 text-blue-700 border-blue-200', Completed: 'bg-green-50 text-green-700 border-green-200', Cancelled: 'bg-red-50 text-red-600 border-red-200' };

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 className="w-8 h-8 animate-spin mr-3 text-teal-800" />Loading...</div>;

  return (
    <div>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .invoice-print, .invoice-print * { visibility: visible !important; }
          .invoice-print { position: fixed !important; inset: 0 !important; width: 210mm !important; min-height: 297mm !important; background: white !important; padding: 16mm !important; box-sizing: border-box !important; z-index: 99999 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Patients</h2>
          <p className="text-slate-500 text-sm mt-0.5">{patients.length} patient files</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, invoice..." className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm w-52 focus:outline-none focus:border-teal-800 shadow-sm" />
          </div>
          <button onClick={load} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-teal-800 shadow-sm transition-all"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
            <Plus className="w-4 h-4" /> New Patient
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            {['Invoice', 'Patient', 'Treatment', 'Sessions', 'Total', 'Discount', 'Final', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-16 text-slate-400"><FileText className="w-10 h-10 mx-auto mb-3 opacity-20" /><p>No patient files found.</p></td></tr>
            ) : filtered.map(p => (
              <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs font-bold text-teal-800">{p.invoiceNumber}</td>
                <td className="px-4 py-3.5">
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <a href={`tel:${p.phone}`} className="text-xs text-slate-500 hover:text-teal-800">{p.phone}</a>
                </td>
                <td className="px-4 py-3.5 text-slate-700 text-xs max-w-[140px] truncate">{p.treatmentName || '—'}</td>
                <td className="px-4 py-3.5 text-center text-slate-700 font-bold">{p.sessionCount}</td>
                <td className="px-4 py-3.5 text-slate-700 font-semibold whitespace-nowrap">PKR {Number(p.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs">{p.discount > 0 ? `${p.discount}${p.discountType}` : '—'}</td>
                <td className="px-4 py-3.5 font-black text-teal-800 whitespace-nowrap">PKR {Number(p.finalAmount).toLocaleString()}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setInvoicePatient(p)} className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center hover:bg-teal-100 transition-all" title="View Invoice"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id} className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all disabled:opacity-50">
                      {deleting === p._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Patient Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Create Patient File</h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                  <input value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="Patient name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone *</label>
                  <input value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} placeholder="+92 300 0000000" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input value={form.email} onChange={e => handleFormChange('email', e.target.value)} placeholder="patient@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Treatment</label>
                  <select value={form.treatmentName} onChange={e => handleFormChange('treatmentName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all">
                    <option value="">Select treatment...</option>
                    {treatments.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sessions</label>
                  <input type="number" min="1" value={form.sessionCount} onChange={e => handleFormChange('sessionCount', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                  {/* Show available packages */}
                  {form.treatmentName && (() => { const t = treatments.find(t => t.name === form.treatmentName); return t?.sessionPackages?.length > 0 ? (
                    <p className="text-xs text-slate-400 mt-1">Packages: {t.sessionPackages.map(p => `${p.sessions}s=PKR${p.price.toLocaleString()}`).join(', ')}</p>
                  ) : null; })()}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price / Session (PKR)</label>
                  <input type="number" min="0" value={form.pricePerSession} onChange={e => handleFormChange('pricePerSession', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Amount (PKR)</label>
                  <input type="number" min="0" value={form.totalAmount} onChange={e => { setForm(p => { const n = { ...p, totalAmount: e.target.value }; n.finalAmount = calcFinal(e.target.value, n.discount, n.discountType); return n; }); }} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Discount</label>
                  <div className="flex gap-2">
                    <input type="number" min="0" value={form.discount} onChange={e => { setForm(p => { const n = { ...p, discount: e.target.value }; n.finalAmount = calcFinal(n.totalAmount, e.target.value, n.discountType); return n; }); }} className="flex-1 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                    <select value={form.discountType} onChange={e => { setForm(p => { const n = { ...p, discountType: e.target.value }; n.finalAmount = calcFinal(n.totalAmount, n.discount, e.target.value); return n; }); }} className="w-20 px-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all">
                      <option value="%">%</option>
                      <option value="PKR">PKR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Final Amount (PKR) — Editable</label>
                  <input type="number" min="0" value={form.finalAmount} onChange={e => setForm(p => ({ ...p, finalAmount: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-teal-800 bg-teal-50 text-teal-900 font-black text-sm focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                  <select value={form.status} onChange={e => handleFormChange('status', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all">
                    <option>Active</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</label>
                  <textarea value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} rows={2} placeholder="Any notes about the patient..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all resize-none" />
                </div>
              </div>
              {/* Summary */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Total ({form.sessionCount} sessions)</span><span className="font-semibold">PKR {Number(form.totalAmount).toLocaleString()}</span></div>
                {form.discount > 0 && <div className="flex justify-between text-sm mb-1 text-red-600"><span>Discount ({form.discount}{form.discountType})</span><span>- PKR {(Number(form.totalAmount) - Number(form.finalAmount)).toLocaleString()}</span></div>}
                <div className="flex justify-between text-base font-black border-t border-teal-200 pt-2 mt-2"><span className="text-slate-900">Final Amount</span><span className="text-teal-800">PKR {Number(form.finalAmount).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Create File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoicePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm no-print" onClick={() => setInvoicePatient(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 no-print">
              <h3 className="font-black text-slate-900">Invoice Preview</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all">
                  <Printer className="w-4 h-4" /> Print / Download PDF
                </button>
                <button onClick={() => setInvoicePatient(null)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Printable Invoice */}
            <div className="invoice-print p-8 bg-white">
              {/* Header */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-slate-900">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Anjum Dentist Clinic</h1>
                    <p className="text-slate-500 text-sm">{clinicSettings.address || 'Karachi, Pakistan'}</p>
                    <p className="text-slate-500 text-sm">{clinicSettings.phone || ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-teal-800 text-white px-6 py-2 rounded-xl inline-block mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest">Invoice</p>
                    <p className="text-xl font-black">{invoicePatient.invoiceNumber}</p>
                  </div>
                  <p className="text-slate-500 text-sm">Date: {new Date(invoicePatient.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-slate-500 text-sm">Status: <span className="font-bold text-slate-700">{invoicePatient.status}</span></p>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Patient Details</h3>
                  <p className="font-black text-slate-900 text-lg">{invoicePatient.name}</p>
                  <p className="text-slate-600 text-sm mt-1">{invoicePatient.phone}</p>
                  {invoicePatient.email && <p className="text-slate-600 text-sm">{invoicePatient.email}</p>}
                </div>
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Treatment Details</h3>
                  <p className="font-black text-slate-900">{invoicePatient.treatmentName || 'N/A'}</p>
                  <p className="text-slate-600 text-sm mt-1">{invoicePatient.sessionCount} Session{invoicePatient.sessionCount !== 1 ? 's' : ''}</p>
                  <p className="text-slate-600 text-sm">PKR {Number(invoicePatient.pricePerSession).toLocaleString()} per session</p>
                </div>
              </div>

              {/* Pricing Table */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pricing Breakdown</h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-800 text-white">
                      <th className="text-left px-5 py-3 font-bold">Description</th>
                      <th className="text-right px-5 py-3 font-bold">Sessions</th>
                      <th className="text-right px-5 py-3 font-bold">Rate</th>
                      <th className="text-right px-5 py-3 font-bold">Amount</th>
                    </tr></thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">{invoicePatient.treatmentName || 'Treatment'}</td>
                        <td className="px-5 py-4 text-right text-slate-700">{invoicePatient.sessionCount}</td>
                        <td className="px-5 py-4 text-right text-slate-700">PKR {Number(invoicePatient.pricePerSession).toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-bold text-slate-900">PKR {Number(invoicePatient.totalAmount).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-slate-50 px-5 py-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>PKR {Number(invoicePatient.totalAmount).toLocaleString()}</span></div>
                    {invoicePatient.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Discount ({invoicePatient.discount}{invoicePatient.discountType})</span>
                        <span>- PKR {(Number(invoicePatient.totalAmount) - Number(invoicePatient.finalAmount)).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-black border-t border-slate-300 pt-3 text-slate-900">
                      <span>Total Due</span><span className="text-teal-800">PKR {Number(invoicePatient.finalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {invoicePatient.notes && (
                <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notes</h3>
                  <p className="text-slate-700 text-sm">{invoicePatient.notes}</p>
                </div>
              )}

              <div className="text-center border-t border-slate-200 pt-6">
                <p className="text-slate-500 text-sm">Thank you for choosing <strong>Anjum Dentist Clinic</strong>.</p>
                <p className="text-slate-400 text-xs mt-1">For queries, contact us at {clinicSettings.phone || 'our clinic'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
