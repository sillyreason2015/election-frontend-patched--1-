'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready) return <div className="container py-10">Loading…</div>;
  if (!user) return null;
  return <>{children}</>;
}
