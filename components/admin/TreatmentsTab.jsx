'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', image: '', basePrice: '', sessionPackages: [] };

export default function TreatmentsTab() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/treatments');
      const d = await r.json();
      if (d.success) setTreatments(d.data);
    } catch { toast.error('Failed to load treatments.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal(true); };
  const openEdit = (t) => { setForm({ name: t.name, description: t.description, image: t.image, basePrice: t.basePrice, sessionPackages: t.sessionPackages || [] }); setEditing(t._id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY_FORM); };

  const addPackage = () => setForm(p => ({ ...p, sessionPackages: [...p.sessionPackages, { sessions: '', price: '' }] }));
  const removePackage = (i) => setForm(p => ({ ...p, sessionPackages: p.sessionPackages.filter((_, idx) => idx !== i) }));
  const updatePackage = (i, key, val) => setForm(p => ({
    ...p,
    sessionPackages: p.sessionPackages.map((pkg, idx) => idx === i ? { ...pkg, [key]: val } : pkg),
  }));

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Treatment name is required.');
    if (!form.basePrice) return toast.error('Base price is required.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        basePrice: Number(form.basePrice),
        sessionPackages: form.sessionPackages.filter(p => p.sessions && p.price).map(p => ({ sessions: Number(p.sessions), price: Number(p.price) })),
      };
      const url = editing ? `/api/treatments/${editing}` : '/api/treatments';
      const method = editing ? 'PATCH' : 'POST';
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { toast.success(editing ? 'Treatment updated!' : 'Treatment added!'); closeModal(); load(); }
      else toast.error(d.error || 'Failed to save.');
    } catch { toast.error('Network error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/treatments/${id}`, { method: 'DELETE' });
      toast.success('Deleted.');
      load();
    } catch { toast.error('Delete failed.'); }
    finally { setDeleting(null); }
  };

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 className="w-8 h-8 animate-spin mr-3 text-teal-800" />Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Treatments</h2>
          <p className="text-slate-500 text-sm mt-0.5">{treatments.length} treatment{treatments.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Treatment
        </button>
      </div>

      {treatments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Plus className="w-7 h-7 opacity-40" /></div>
          <p className="font-semibold">No treatments yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {treatments.map((t) => (
            <div key={t._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              {t.image ? (
                <img src={t.image} alt={t.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-black text-slate-900 text-base leading-tight">{t.name}</h3>
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    <button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-500 flex items-center justify-center transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t._id, t.name)} disabled={deleting === t._id} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all disabled:opacity-50">
                      {deleting === t._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                {t.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{t.description}</p>}
                <p className="text-teal-800 font-black text-lg">PKR {Number(t.basePrice).toLocaleString()}</p>
                {t.sessionPackages?.length > 0 && (
                  <div className="mt-3">
                    <button onClick={() => setExpanded(expanded === t._id ? null : t._id)} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-800 transition-colors">
                      Session Packages ({t.sessionPackages.length}) {expanded === t._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {expanded === t._id && (
                      <div className="mt-2 space-y-1">
                        {t.sessionPackages.map((pkg, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                            <span className="text-xs font-semibold text-slate-600">{pkg.sessions} Sessions</span>
                            <span className="text-xs font-black text-teal-800">PKR {Number(pkg.price).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">{editing ? 'Edit Treatment' : 'Add Treatment'}</h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Treatment Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dental Implants" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the treatment..." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/10 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image URL</label>
                <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Base Price (PKR) *</label>
                <input type="number" value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))} placeholder="0" min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/10 transition-all" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Packages</label>
                  <button type="button" onClick={addPackage} className="flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-900 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Package</button>
                </div>
                <div className="space-y-2">
                  {form.sessionPackages.map((pkg, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="number" value={pkg.sessions} onChange={e => updatePackage(i, 'sessions', e.target.value)} placeholder="Sessions" min="1" className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                      <input type="number" value={pkg.price} onChange={e => updatePackage(i, 'price', e.target.value)} placeholder="Price PKR" min="0" className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                      <button onClick={() => removePackage(i)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  {form.sessionPackages.length === 0 && <p className="text-slate-400 text-xs italic">No session packages. Click "Add Package" to add pricing tiers.</p>}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Treatment</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
