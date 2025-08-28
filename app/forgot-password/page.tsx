'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr(null); setMsg(null);
    try {
      await api.forgotPassword(email);
      setMsg('If that email exists, a reset link/code has been sent.');
    } catch (e: any) {
      setErr(e?.message || 'Request failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-6">Forgot Password</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          {err && <p className="text-sm text-red-600">{err}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
        </form>
      </div>
    </div>
  );
}
