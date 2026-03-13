import { apiFetch, getAuthHeaders } from './api';
import type { CreatePegawaiPayload, PegawaiListData, UpdatePegawaiPayload } from '@/types/pegawai';
import type { AssignShiftPayload, ShiftPegawai } from '@/types/shift';
import type { RiwayatPresensiData } from '@/types/presensi';

const BASE = '/api/v1/admin/pegawai';

export function getPegawaiList(page = 1, limit = 10, search?: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  return apiFetch<PegawaiListData>(`${BASE}?${params}`, { headers: getAuthHeaders() });
}

export function createPegawai(payload: CreatePegawaiPayload) {
  return apiFetch<unknown>(BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getAuthHeaders(),
  });
}

export function updatePegawai(id: number, payload: UpdatePegawaiPayload) {
  return apiFetch<unknown>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: getAuthHeaders(),
  });
}

export function deletePegawai(id: number) {
  return apiFetch<unknown>(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

export function getShiftPegawai(pegawaiId: number) {
  return apiFetch<ShiftPegawai[]>(`${BASE}/${pegawaiId}/shift`, { headers: getAuthHeaders() });
}

export function assignShiftPegawai(pegawaiId: number, payload: AssignShiftPayload) {
  return apiFetch<unknown>(`${BASE}/${pegawaiId}/assign-shift`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getAuthHeaders(),
  });
}

export function getRiwayatPresensiAdmin(params: {
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.tanggal_mulai) query.set('tanggal_mulai', params.tanggal_mulai);
  if (params.tanggal_selesai) query.set('tanggal_selesai', params.tanggal_selesai);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  return apiFetch<RiwayatPresensiData>(`${BASE}/riwayat-presensi?${query}`, {
    headers: getAuthHeaders(),
  });
}
