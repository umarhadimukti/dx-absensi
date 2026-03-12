'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, LogIn, LogOut, AlarmClock } from 'lucide-react';
import { getTodayStatus } from '@/lib/presensi-api';
import { useAuth } from '@/hooks/useAuth';
import { PresensiModal } from '@/components/presensi/PresensiModal';

const STATUS_STYLE: Record<string, string> = {
  HADIR: 'bg-green-50 text-green-700',
  TERLAMBAT: 'bg-yellow-50 text-yellow-700',
  IZIN: 'bg-blue-50 text-blue-700',
  SAKIT: 'bg-orange-50 text-orange-700',
  ALPHA: 'bg-red-50 text-red-700',
  CUTI: 'bg-purple-50 text-purple-700',
};

function formatTime(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

export default function PresensiPage() {
  const [modal, setModal] = useState<'masuk' | 'keluar' | null>(null);
  const { data: authData } = useAuth();
  const pegawai = authData?.data.pegawai;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['presensi', 'today'],
    queryFn: getTodayStatus,
  });

  const today = data?.data;
  const presensi = today?.presensi;
  const shift = today?.shift;

  const canMasuk = !presensi;
  const canKeluar = !!presensi && !presensi.jam_keluar;
  const selesai = !!presensi?.jam_keluar;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Presensi</h1>
        <p className="mt-1 text-sm text-gray-500">{formatDate(new Date().toISOString())}</p>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
          Memuat data...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-500">
          Gagal memuat data presensi.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Info Pegawai & Shift */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Informasi
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-gray-900">{pegawai?.nama ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">NIP</span>
                <span className="font-medium text-gray-900">{pegawai?.nip ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jabatan</span>
                <span className="font-medium text-gray-900">{pegawai?.jabatan ?? '-'}</span>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Shift Hari Ini
              </p>
              {shift ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shift</span>
                    <span className="font-medium text-gray-900">{shift.nama_shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jam Masuk</span>
                    <span className="font-medium text-gray-900">{shift.jam_masuk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jam Keluar</span>
                    <span className="font-medium text-gray-900">{shift.jam_keluar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Toleransi</span>
                    <span className="font-medium text-gray-900">{shift.toleransi} menit</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Tidak ada shift aktif</p>
              )}
            </div>
          </div>

          {/* Status Presensi */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Status Presensi
            </p>

            {!presensi && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlarmClock size={36} className="mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">Belum absen masuk</p>
                <p className="mt-1 text-xs text-gray-400">
                  Silakan lakukan absen masuk terlebih dahulu
                </p>
              </div>
            )}

            {presensi && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[presensi.status] ?? 'bg-gray-100 text-gray-500'}`}
                  >
                    {presensi.status}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                    <LogIn size={16} />
                    Masuk
                  </div>
                  <span className="text-sm font-semibold text-green-800">
                    {formatTime(presensi.jam_masuk)}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between rounded-lg px-4 py-3 ${presensi.jam_keluar ? 'bg-red-50' : 'bg-gray-50'}`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${presensi.jam_keluar ? 'text-red-700' : 'text-gray-400'}`}
                  >
                    <LogOut size={16} />
                    Keluar
                  </div>
                  <span
                    className={`text-sm font-semibold ${presensi.jam_keluar ? 'text-red-800' : 'text-gray-400'}`}
                  >
                    {formatTime(presensi.jam_keluar)}
                  </span>
                </div>

                {presensi.keterangan && (
                  <p className="text-xs italic text-gray-500">Ket: {presensi.keterangan}</p>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
              {canMasuk && (
                <button
                  onClick={() => setModal('masuk')}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
                >
                  <Clock size={16} />
                  Absen Masuk
                </button>
              )}
              {canKeluar && (
                <button
                  onClick={() => setModal('keluar')}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  <Clock size={16} />
                  Absen Keluar
                </button>
              )}
              {selesai && (
                <div className="rounded-lg bg-gray-50 py-3 text-center text-sm font-medium text-gray-500">
                  Presensi hari ini selesai
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <PresensiModal open={true} type={modal} onClose={() => setModal(null)} />
      )}
    </main>
  );
}
