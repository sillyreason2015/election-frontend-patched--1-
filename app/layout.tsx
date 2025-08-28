import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Election Management System',
  description: 'Vote securely. Manage elections. Visualize results.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 container py-6">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
