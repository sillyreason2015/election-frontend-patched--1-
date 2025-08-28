'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Protected } from '@/components/Protected';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function ResultsPage() {
  return (
    <Protected>
      <ResultsInner />
    </Protected>
  );
}

function ResultsInner() {
  const { electionId } = useParams<{ electionId: string }>();
  const [data, setData] = useState<{ name: string; votes: number }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  useEffect(()=>{
    (async()=>{
      const res = await api.getResults(String(electionId));
      setTitle(res?.election?.title ?? 'Election Results');
      const rows = (res?.totals || []).map((t:any)=> ({ name: t.name || t.candidateName || t.candidateId, votes: Number(t.votes)||0 }));
      setData(rows);
      setTotal(rows.reduce((a,b)=>a+b.votes,0));
    })();
  }, [electionId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Results — {title}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="votes" nameKey="name" outerRadius={110} label>
                {data.map((_, idx) => (<Cell key={idx} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Tabular Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Candidate</th>
                <th>Votes</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row)=> {
                const share = total? ((row.votes/total)*100).toFixed(1)+'%' : '—';
                return (
                  <tr key={row.name} className="border-b">
                    <td className="py-2">{row.name}</td>
                    <td>{row.votes}</td>
                    <td>{share}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
