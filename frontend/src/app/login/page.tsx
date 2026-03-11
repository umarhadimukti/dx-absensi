'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { LoginData } from '@/types/auth';

function loginFn(body: { email: string; password: string }) {
  return apiFetch<LoginData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginFn,
    onSuccess: (res) => {
      const { accessToken, user } = res.data;
      document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      localStorage.setItem('access_token', accessToken);
      
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      const roleRedirect: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        KARYAWAN: '/presensi'
      };
      router.push(roleRedirect[user.role] ?? '/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Masuk</h1>
        <p className="mb-6 text-sm text-gray-500">
          Masukkan email dan password Anda untuk melanjutkan
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              placeholder="nama@perusahaan.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-10 w-full bg-sky-500 text-white hover:bg-sky-600"
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </main>
  );
}
