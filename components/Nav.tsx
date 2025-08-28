'use client';
import Link from 'next/link';
import { useAuth } from '@/components/hooks/useAuth';

export function Nav() {
  const { user, logout, } = useAuth();
  return (
    <nav className="container py-4 flex justify-between items-center">
      <Link href="/" className="font-bold">EMS</Link>
      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <span className="px-3 py-1 rounded-full bg-gray-200">{user.name}</span>
            <button className="btn-outline" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn-outline" href="/login">Login</Link>
            <Link className="btn-primary" href="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
