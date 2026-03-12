const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    // headers setelah ...init agar Content-Type tidak ter-override oleh init.headers
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? 'Terjadi kesalahan');
  }

  return json as ApiResponse<T>;
}

export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
