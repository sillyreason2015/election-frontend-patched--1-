'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace('/dashboard');
    else router.replace('/login');
  }, [user, router]);
  return null;
}
