'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Protected } from '@/components/Protected';
import { api } from '@/lib/api';

export default function VotePage() {
  return (
    <Protected>
      <VoteInner />
    </Protected>
  );
}

function VoteInner() {
  const router = useRouter();
  const { electionId } = useParams<{ electionId: string }>();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [election, setElection] = useState<any | null>(null);
  const [selected, setSelected] = useState<string>('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [es, cs] = await Promise.all([api.getElections(), api.getCandidates()]);
      setElection(es.find((e: any) => e._id === electionId) || null);
      setCandidates(cs);
    })();
  }, [electionId]);

  const now = new Date();
  const disabled = election && (now < new Date(election.startDate) || now > new Date(election.endDate));

  const submit = async () => {
    setErr(null); setMsg(null);
    try {
      await api.castVote({ electionId: String(electionId), candidateId: selected });
      setMsg('Vote cast successfully.');
      setTimeout(()=> router.push(`/results/${electionId}`), 800);
    } catch (e: any) {
      setErr(e?.message || 'Failed to vote');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vote — {election?.title ?? 'Election'}</h1>
      {disabled && (
        <p className="text-sm text-red-600">Voting is closed or not yet open for this election.</p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((c) => (
          <button key={c._id} disabled={disabled} onClick={()=>setSelected(c._id)} className={`card text-left border ${selected===c._id? 'ring-2 ring-blue-600' : ''}`}>
            <div className="flex items-center gap-3">
              {c.photoUrl && <img src={c.photoUrl} className="w-14 h-14 rounded-xl object-cover" alt={c.name} />}
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={!selected || disabled} onClick={submit}>Submit Vote</button>
        {err && <span className="text-red-600 text-sm">{err}</span>}
        {msg && <span className="text-green-700 text-sm">{msg}</span>}
      </div>
    </div>
  );
}
