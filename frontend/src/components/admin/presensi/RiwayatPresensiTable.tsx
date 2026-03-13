'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react';
import { getRiwayatPresensiAdmin } from '@/lib/pegawai-api';
import type { PresensiStatus, RiwayatPresensiItem } from '@/types/presensi';
import { DetailPresensiModal } from './DetailPresensiModal';

const STATUS_STYLE: Record<PresensiStatus, string> = {
  HADIR: 'bg-green-50 text-green-700',
  TERLAMBAT: 'bg-amber-50 text-amber-700',
  IZIN: 'bg-blue-50 text-blue-700',
  SAKIT: 'bg-orange-50 text-orange-700',
  ALPHA: 'bg-red-50 text-red-700',
  CUTI: 'bg-violet-50 text-violet-700',
};

const INPUT_CLASS =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20';

function formatDate(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}

function formatTime(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  });
}

function getThisMonthRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
  return { start: `${y}-${m}-01`, end: `${y}-${m}-${lastDay}` };
}

export default function RiwayatPresensiTable() {
  const [showDetail, setShowDetail] = useState<RiwayatPresensiItem | null>(null)

  const defaultRange = getThisMonthRange();
  const [tanggalMulai, setTanggalMulai] = useState(defaultRange.start);
  const [tanggalSelesai, setTanggalSelesai] = useState(defaultRange.end);
  const [committed, setCommitted] = useState({ mulai: defaultRange.start, selesai: defaultRange.end });
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['riwayat-presensi', committed.mulai, committed.selesai, page],
    queryFn: () =>
      getRiwayatPresensiAdmin({
        tanggal_mulai: committed.mulai || undefined,
        tanggal_selesai: committed.selesai || undefined,
        page,
        limit: 20,
      }),
    staleTime: 1000 * 60 * 2,
  });

  function handleSearch() {
    setPage(1);
    setCommitted({ mulai: tanggalMulai, selesai: tanggalSelesai });
  }

  const list = data?.data.data ?? [];
  const pagination = data?.data.pagination;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Riwayat Presensi</h1>
          <p className="mt-1 text-sm text-gray-500">Lihat riwayat presensi seluruh pegawai</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {/* Filter toolbar */}
        <div className="flex flex-wrap items-end gap-3 border-b px-4 py-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal Mulai</label>
            <input
              type="date"
              className={INPUT_CLASS}
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal Selesai</label>
            <input
              type="date"
              className={INPUT_CLASS}
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 cursor-pointer"
          >
            <Search size={15} />
            Cari
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Departemen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Jam Masuk</th>
                <th className="px-4 py-3">Jam Keluar</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">Memuat data...</td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-red-500">Gagal memuat data.</td>
                </tr>
              )}
              {!isLoading && !isError && list.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    Tidak ada data presensi pada rentang tanggal ini.
                  </td>
                </tr>
              )}
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{formatDate(p.tanggal)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.pegawai.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{p.pegawai.departemen ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatTime(p.jam_masuk)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatTime(p.jam_keluar)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.keterangan ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setShowDetail(p)}
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:border-sky-300 hover:text-sky-600 cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Eye size={14} />
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
              {pagination.total_data} data &bull; Halaman {pagination.page} dari {pagination.total_page}
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
      <DetailPresensiModal
        open={showDetail !== null}
        presensi={showDetail}
        onClose={() => setShowDetail(null)}
      />
    </div>
  );
}
