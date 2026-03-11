'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

export function HeaderNav() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useAuth();
  const user = data?.data;

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    document.cookie = 'access_token=; path=/; max-age=0';
    localStorage.removeItem('access_token');

    queryClient.setQueryData(['auth', 'me'], null);
    router.push('/login');
  }

  if (!mounted || isLoading) {
    return <div className="h-7 w-8 rounded-lg" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        title="Masuk"
        className="rounded-lg border border-sky-500 p-1.5 text-sky-600 transition-colors hover:bg-sky-50"
      >
        <LogIn size={18} />
      </Link>
    );
  }

  const displayName = user.pegawai?.nama ?? user.email;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">
        Halo, <span className="font-semibold text-gray-900">{displayName}</span>
      </span>
      <button
        onClick={handleLogout}
        title="Keluar"
        className="rounded-lg border border-gray-300 p-1.5 text-gray-600 transition-colors hover:border-red-300 hover:text-red-600"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}
