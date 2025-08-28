'use client';
import { useEffect, useMemo, useState } from 'react';
import { Protected } from '@/components/Protected';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}

function DashboardInner() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'users' | 'candidates' | 'elections'>('users');

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-gray-200">{user?.name} ({user?.role})</span>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </header>

      {user?.role !== 'admin' ? (
        <p className="text-red-600">You must be an admin to view this page.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className={`btn ${tab==='users'?'bg-blue-600 text-white':''}`} onClick={()=>setTab('users')}>Users</button>
            <button className={`btn ${tab==='candidates'?'bg-blue-600 text-white':''}`} onClick={()=>setTab('candidates')}>Candidates</button>
            <button className={`btn ${tab==='elections'?'bg-blue-600 text-white':''}`} onClick={()=>setTab('elections')}>Elections</button>
          </div>
          {tab==='users' && <UsersAdmin/>}
          {tab==='candidates' && <CandidatesAdmin/>}
          {tab==='elections' && <ElectionsAdmin/>}
        </div>
      )}
    </div>
  );
}

function UsersAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{(async()=>{ try { const res = await api.getUsers(); setData(res); } finally { setLoading(false);} })();},[]);
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      {loading? <p>Loading…</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u)=> (
                <tr key={u._id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CandidatesAdmin() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const refresh = async()=> setList(await api.getCandidates());
  useEffect(()=>{refresh();},[]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createCandidate({ name, party, photoUrl });
    setName(''); setParty(''); setPhotoUrl('');
    await refresh();
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">New Candidate</h2>
        <form onSubmit={create} className="space-y-3">
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input" placeholder="Party" value={party} onChange={e=>setParty(e.target.value)} required />
          <input className="input" placeholder="Photo URL (optional)" value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} />
          <button className="btn-primary">Create</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Candidates</h2>
        <ul className="space-y-2">
          {list.map((c)=> (
            <li key={c._id} className="flex items-center justify-between border rounded-2xl p-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
              </div>
              {c.photoUrl && <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-xl object-cover" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ElectionsAdmin() {
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const refresh = async()=> setList(await api.getElections());
  useEffect(()=>{refresh();},[]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createElection({ title, startDate, endDate });
    setTitle(''); setStartDate(''); setEndDate('');
    await refresh();
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Create Election</h2>
        <form onSubmit={create} className="space-y-3">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <input className="input" type="datetime-local" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
          <input className="input" type="datetime-local" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
          <button className="btn-primary">Create</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Elections</h2>
        <ul className="space-y-2">
          {list.map((e:any)=> (
            <li key={e._id} className="flex flex-wrap items-center justify-between gap-2 border rounded-2xl p-3">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-gray-600">{new Date(e.startDate).toLocaleString()} → {new Date(e.endDate).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <a className="btn-outline" href={`/vote/${e._id}`}>Vote</a>
                <a className="btn-outline" href={`/results/${e._id}`}>Results</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
