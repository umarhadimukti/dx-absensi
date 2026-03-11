'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { MeData } from '@/types/auth';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => {
      const token = getToken();
      if (!token) return Promise.resolve(null);
      return apiFetch<MeData>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
