'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2, UserCheck, UserX, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['Receptionist', 'Dentist', 'Assistant', 'Manager', 'Cleaner'];
const EMPTY_FORM = { name: '', phone: '', password: '', role: 'Receptionist', isActive: true };

const ROLE_COLORS = {
  Dentist: 'bg-purple-50 text-purple-700 border-purple-200',
  Manager: 'bg-blue-50 text-blue-700 border-blue-200',
  Receptionist: 'bg-teal-50 text-teal-700 border-teal-200',
  Assistant: 'bg-amber-50 text-amber-700 border-amber-200',
  Cleaner: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function StaffUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/staff/users');
      const d = await r.json();
      if (d.success) setUsers(d.data);
    } catch { toast.error('Failed to load staff.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setShowPass(false); setModal(true); };
  const openEdit = (u) => { setForm({ name: u.name, phone: u.phone, password: '', role: u.role, isActive: u.isActive }); setEditing(u._id); setShowPass(false); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) return toast.error('Name and phone are required.');
    if (!editing && !form.password.trim()) return toast.error('Password is required for new users.');
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      const url = editing ? `/api/staff/users/${editing}` : '/api/staff/users';
      const method = editing ? 'PATCH' : 'POST';
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { toast.success(editing ? 'User updated!' : 'User created!'); closeModal(); load(); }
      else toast.error(d.error || 'Failed.');
    } catch { toast.error('Network error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    setDeleting(id);
    try { await fetch(`/api/staff/users/${id}`, { method: 'DELETE' }); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (u) => {
    try {
      await fetch(`/api/staff/users/${u._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !u.isActive }) });
      toast.success(`User ${!u.isActive ? 'activated' : 'deactivated'}.`);
      load();
    } catch { toast.error('Failed.'); }
  };

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 className="w-8 h-8 animate-spin mr-3 text-teal-800" />Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Users</h2>
          <p className="text-slate-500 text-sm mt-0.5">{users.filter(u => u.isActive).length} active · {users.length} total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <div className="sm:col-span-3 flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><UserCheck className="w-7 h-7 opacity-40" /></div>
            <p className="font-semibold">No staff users yet.</p>
          </div>
        ) : users.map(u => (
          <div key={u._id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${u.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
                <span className="text-teal-800 font-black text-lg">{u.name[0].toUpperCase()}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(u)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-500 flex items-center justify-center transition-all" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => toggleActive(u)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${u.isActive ? 'bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500' : 'bg-green-50 text-green-600 hover:bg-green-100'}`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                  {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(u._id, u.name)} disabled={deleting === u._id} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all disabled:opacity-50">
                  {deleting === u._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <p className="font-black text-slate-900 text-base">{u.name}</p>
            <a href={`tel:${u.phone}`} className="text-sm text-slate-500 hover:text-teal-800 transition-colors">{u.phone}</a>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{u.role}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${u.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">Logs in with phone number</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">{editing ? 'Edit Staff User' : 'Add Staff User'}</h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Staff member name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number * (used to login)</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+92 300 0000000" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder={editing ? 'Leave blank to keep current' : 'Set a password'} className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-teal-800 transition-all">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              {editing && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-teal-800" />
                  <span className="text-sm font-semibold text-slate-700">Active (can login)</span>
                </label>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold rounded-xl disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save User</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
