import { apiFetch, getAuthHeaders } from './api';
import type { ApiResponse } from './api';
import type { PresensiData, TodayStatusData } from '@/types/presensi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005';

export function getTodayStatus() {
  return apiFetch<TodayStatusData>('/api/v1/pegawai/presensi-pegawai/today', {
    headers: getAuthHeaders(),
  });
}

async function uploadPresensi(
  endpoint: string,
  foto: Blob,
  extra?: Record<string, string>,
): Promise<ApiResponse<PresensiData>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const formData = new FormData();
  formData.append('foto', foto, 'foto.jpg');
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => formData.append(k, v));
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Terjadi kesalahan');
  return json as ApiResponse<PresensiData>;
}

export function presensiMasuk(foto: Blob, lokasi?: string) {
  return uploadPresensi(
    '/api/v1/pegawai/presensi-pegawai/masuk',
    foto,
    lokasi ? { lokasi_masuk: lokasi } : undefined,
  );
}

export function presensiKeluar(foto: Blob, lokasi?: string) {
  return uploadPresensi(
    '/api/v1/pegawai/presensi-pegawai/keluar',
    foto,
    lokasi ? { lokasi_keluar: lokasi } : undefined,
  );
}
