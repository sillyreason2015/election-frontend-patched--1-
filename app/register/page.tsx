'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null); setMessage(null);
    try {
      await api.register({ name, email, password });
      setMessage('Registration successful. Please verify your email/OTP if required, then log in.');
      setTimeout(()=> router.push('/login'), 1200);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
        </form>
        <div className="mt-4 text-sm">
          Already have an account? <button className="underline" onClick={()=>location.assign('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}
