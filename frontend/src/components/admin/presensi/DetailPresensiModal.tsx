'use client';

import { X, Clock, Calendar, MapPin, ImageOff } from 'lucide-react';
import type { PresensiStatus, RiwayatPresensiItem } from '@/types/presensi';
import { API_BASE } from '@/lib/api';

const STATUS_STYLE: Record<PresensiStatus, string> = {
  HADIR: 'bg-green-50 text-green-700',
  TERLAMBAT: 'bg-amber-50 text-amber-700',
  IZIN: 'bg-blue-50 text-blue-700',
  SAKIT: 'bg-orange-50 text-orange-700',
  ALPHA: 'bg-red-50 text-red-700',
  CUTI: 'bg-violet-50 text-violet-700',
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

function formatTime(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  });
}

function PhotoBox({ label, src }: { label: string; src: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      {src ? (
        <img
          src={`${API_BASE}/${src}`}
          alt={label}
          className="w-full rounded-lg border border-gray-200 object-cover"
          style={{ maxHeight: 260 }}
        />
      ) : (
        <div className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-400">
          <ImageOff size={24} />
          <span className="text-xs">Tidak ada foto</span>
        </div>
      )}
    </div>
  );
}

interface Props {
  open: boolean;
  presensi: RiwayatPresensiItem | null;
  onClose: () => void;
}

export function DetailPresensiModal({ open, presensi, onClose }: Props) {
  if (!open || !presensi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Detail Presensi</h2>
            <p className="text-sm text-gray-500">{presensi.pegawai.nama} &bull; {presensi.pegawai.nip}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {/* Info row */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{formatDate(presensi.tanggal)}</span>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[presensi.status]}`}>
              {presensi.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500">Jam Masuk</span>
              <div className="flex items-center gap-1 font-medium text-gray-800">
                <Clock size={13} className="text-gray-400" />
                {formatTime(presensi.jam_masuk)}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500">Jam Keluar</span>
              <div className="flex items-center gap-1 font-medium text-gray-800">
                <Clock size={13} className="text-gray-400" />
                {formatTime(presensi.jam_keluar)}
              </div>
            </div>
            {presensi.lokasi_masuk && (
              <div className="col-span-2 flex flex-col gap-0.5">
                <span className="text-xs text-gray-500">Lokasi Masuk</span>
                <div className="flex items-center gap-1 text-gray-700">
                  <MapPin size={13} className="text-gray-400" />
                  {presensi.lokasi_masuk}
                </div>
              </div>
            )}
            {presensi.lokasi_keluar && (
              <div className="col-span-2 flex flex-col gap-0.5">
                <span className="text-xs text-gray-500">Lokasi Keluar</span>
                <div className="flex items-center gap-1 text-gray-700">
                  <MapPin size={13} className="text-gray-400" />
                  {presensi.lokasi_keluar}
                </div>
              </div>
            )}
            {presensi.keterangan && (
              <div className="col-span-2 flex flex-col gap-0.5">
                <span className="text-xs text-gray-500">Keterangan</span>
                <span className="text-gray-700">{presensi.keterangan}</span>
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="grid grid-cols-2 gap-4">
            <PhotoBox label="Foto Masuk" src={presensi.foto_masuk} />
            <PhotoBox label="Foto Keluar" src={presensi.foto_keluar} />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
