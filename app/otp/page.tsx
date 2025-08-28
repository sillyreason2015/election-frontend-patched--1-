'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function OtpPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setMsg(null);
    try {
      await api.verifyOtp({ email, otp });
      setMsg('OTP verified. You can now log in.');
    } catch (e: any) {
      setErr(e?.message || 'Verification failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-6">Verify OTP</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} required />
          {err && <p className="text-sm text-red-600">{err}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}
          <button className="btn-primary w-full">Verify</button>
        </form>
      </div>
    </div>
  );
}
