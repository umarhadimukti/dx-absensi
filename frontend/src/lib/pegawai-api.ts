import { apiFetch, getAuthHeaders } from './api';
import type { CreatePegawaiPayload, PegawaiListData, UpdatePegawaiPayload } from '@/types/pegawai';

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
