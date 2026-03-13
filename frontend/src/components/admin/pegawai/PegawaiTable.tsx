'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { getPegawaiList } from '@/lib/pegawai-api';
import type { Pegawai } from '@/types/pegawai';

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  HR: 'HR',
  KARYAWAN: 'Karyawan',
};

interface Props {
  onAdd: () => void;
  onEdit: (pegawai: Pegawai) => void;
  onDelete: (pegawai: Pegawai) => void;
  onAssignShift: (pegawai: Pegawai) => void;
}

export function PegawaiTable({ onAdd, onEdit, onDelete, onAssignShift }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pegawai', page, debouncedSearch],
    queryFn: () => getPegawaiList(page, 5, debouncedSearch || undefined),
    staleTime: 1000 * 60 * 5,
  });

  const list = data?.data.data ?? [];
  const pagination = data?.data.pagination;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 cursor-pointer"
        >
          <Plus size={16} />
          Tambah Pegawai
        </button>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIP, email..."
            className="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">NIP</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Departemen</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-400">Memuat data...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-red-500">Gagal memuat data.</td>
              </tr>
            )}
            {!isLoading && !isError && list.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-400">Tidak ada data pegawai.</td>
              </tr>
            )}
            {list.map((p, idx) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">
                  {((page - 1) * 10) + idx + 1}
                </td>
                <td className="px-4 py-3 text-xs text-gray-700">{p.nip}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.nama}</td>
                <td className="px-4 py-3 text-gray-600">{p.user.email}</td>
                <td className="px-4 py-3 text-gray-600">{p.departemen ?? '-'}</td>
                <td className="px-4 py-3 text-gray-600">{p.jabatan ?? '-'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                    {ROLE_LABEL[p.user.role] ?? p.user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_aktif ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onAssignShift(p)}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:border-violet-300 hover:text-violet-600 cursor-pointer"
                      title="Assign Shift"
                    >
                      <CalendarDays size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:border-sky-300 hover:text-sky-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:border-red-300 hover:text-red-600 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_page > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-600">
          <span>
            {pagination.total_data} pegawai &bull; Halaman {pagination.page} dari {pagination.total_page}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.total_page, p + 1))}
              disabled={page === pagination.total_page}
              className="rounded-lg border p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
