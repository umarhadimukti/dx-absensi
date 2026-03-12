import { apiFetch, getAuthHeaders } from "./api";
import type { CreateShiftPayload, ShiftListData, UpdateShiftPayload } from "@/types/shift";

const BASE = '/api/v1/admin/shift';

export const getShiftlist = (page = 1, limit = 10, search?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  return apiFetch<ShiftListData>(`${BASE}?${params}`, { headers: getAuthHeaders() });
}

export const createShift = (payload: CreateShiftPayload) => {
  return apiFetch<unknown>(BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getAuthHeaders(),
  });
}

export const updateShift = (id: number, payload: UpdateShiftPayload) => {
  return apiFetch<unknown>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: getAuthHeaders(),
  })
}

export const deleteShift = (id: number) => {
  return apiFetch<unknown>(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}