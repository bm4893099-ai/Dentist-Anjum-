'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, QrCode } from 'lucide-react';

function ScanContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const date = params.get('date');
  const [status, setStatus] = useState('loading'); // loading | success | error | already
  const [message, setMessage] = useState('');

  useEffect(() => {
    const mark = async () => {
      if (!token || !date) { setStatus('error'); setMessage('Invalid QR code.'); return; }
      try {
        const meRes = await fetch('/api/staff/me');
        const meData = await meRes.json();
        if (!meData.success) { router.replace(`/user/login?redirect=/user/scan?token=${token}&date=${date}`); return; }
        const user = meData.data;
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, userName: user.name, userPhone: user.phone, date, token }),
        });
        const data = await res.json();
        if (data.success) { setStatus('success'); setMessage('Attendance marked successfully!'); }
        else if (res.status === 409) { setStatus('already'); setMessage('Your attendance for today is already marked.'); }
        else { setStatus('error'); setMessage(data.error || 'Failed to mark attendance.'); }
      } catch { setStatus('error'); setMessage('Network error. Please try again.'); }
    };
    mark();
  }, [token, date, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-teal-800 animate-spin mx-auto mb-4" />
            <h2 className="text-slate-900 font-black text-xl">Marking Attendance...</h2>
            <p className="text-slate-400 text-sm mt-2">Please wait.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9 text-green-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-slate-900 font-black text-xl mb-2">Attendance Marked!</h2>
            <p className="text-slate-500 text-sm mb-6">{message}</p>
            <button onClick={() => router.push('/user/panel')} className="w-full py-3.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm rounded-2xl transition-all">
              Go to My Panel
            </button>
          </>
        )}
        {(status === 'error' || status === 'already') && (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${status === 'already' ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
              {status === 'already'
                ? <CheckCircle className="w-9 h-9 text-amber-600" strokeWidth={1.5} />
                : <XCircle className="w-9 h-9 text-red-500" strokeWidth={1.5} />
              }
            </div>
            <h2 className={`font-black text-xl mb-2 ${status === 'already' ? 'text-amber-700' : 'text-slate-900'}`}>
              {status === 'already' ? 'Already Marked' : 'Error'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">{message}</p>
            <button onClick={() => router.push('/user/panel')} className="w-full py-3.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm rounded-2xl transition-all">
              Go to My Panel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-800" />
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
