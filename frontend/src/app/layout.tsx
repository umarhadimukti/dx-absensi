import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Dexa Absensi',
  description: 'Sistem manajemen kehadiran karyawan Dexa Group',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <QueryProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
