'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getShiftlist } from '@/lib/shift-api';
import type { Shift } from '@/types/shift';

interface Props {
  onAdd: () => void;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
}

export function ShiftTable({ onAdd, onEdit, onDelete }: Props) {
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
    queryKey: ['shift', page, debouncedSearch],
    queryFn: () => getShiftlist(page, 5, debouncedSearch || undefined),
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
          Tambah Shift
        </button>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari shift..."
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
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jam Masuk</th>
              <th className="px-4 py-3">Jam Keluar</th>
              <th className="px-4 py-3">Toleransi</th>
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
            {list.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">
                  {((page - 1) * 10) + idx + 1}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{s.nama_shift}</td>
                <td className="px-4 py-3 text-gray-600">{s.jam_masuk}</td>
                <td className="px-4 py-3 text-gray-600">{s.jam_keluar}</td>
                <td className="px-4 py-3 text-gray-600">{s.toleransi} menit</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.is_aktif ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.is_aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(s)}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:border-sky-300 hover:text-sky-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(s)}
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
            {pagination.total_data} shift &bull; Halaman {pagination.page} dari {pagination.total_page}
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
