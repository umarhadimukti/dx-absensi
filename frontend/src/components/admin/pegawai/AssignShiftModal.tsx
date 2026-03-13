'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, CalendarDays } from 'lucide-react';
import { assignShiftPegawai, getShiftPegawai } from '@/lib/pegawai-api';
import { getShiftlist } from '@/lib/shift-api';
import type { Pegawai } from '@/types/pegawai';
import type { AssignShiftPayload } from '@/types/shift';

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20';

interface Props {
  open: boolean;
  pegawai: Pegawai | null;
  onClose: () => void;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function AssignShiftModal({ open, pegawai, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AssignShiftPayload>({ shift_id: 0, berlaku_dari: '' });

  const { data: shiftListData } = useQuery({
    queryKey: ['shift'],
    queryFn: () => getShiftlist(1, 100),
    enabled: open,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['shift-pegawai', pegawai?.id],
    queryFn: () => getShiftPegawai(pegawai!.id),
    enabled: open && !!pegawai,
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => assignShiftPegawai(pegawai!.id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-pegawai', pegawai?.id] });
      setForm({ shift_id: 0, berlaku_dari: '' });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate();
  }

  if (!open || !pegawai) return null;

  const masterShifts = shiftListData?.data.data ?? [];
  const history = historyData?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Assign Shift</h2>
            <p className="text-xs text-gray-500 mt-0.5">{pegawai.nama}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Assign Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 border-b">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Assign Shift Baru</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Shift <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className={INPUT_CLASS}
                  value={form.shift_id || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, shift_id: Number(e.target.value) }))}
                >
                  <option value="">Pilih shift...</option>
                  {masterShifts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_shift} ({s.jam_masuk} – {s.jam_keluar})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Berlaku Dari <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className={INPUT_CLASS}
                  value={form.berlaku_dari}
                  onChange={(e) => setForm((prev) => ({ ...prev, berlaku_dari: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Berlaku Sampai
                </label>
                <input
                  type="date"
                  className={INPUT_CLASS}
                  value={form.berlaku_sampai ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      berlaku_sampai: e.target.value || undefined,
                    }))
                  }
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded-lg bg-sky-500 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Menyimpan...' : 'Assign Shift'}
            </button>
          </form>

          {/* History */}
          <div className="px-6 py-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Riwayat Shift</h3>
            {historyLoading && (
              <p className="text-center text-sm text-gray-400 py-4">Memuat...</p>
            )}
            {!historyLoading && history.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
                <CalendarDays size={28} />
                <p className="text-sm">Belum ada shift yang di-assign</p>
              </div>
            )}
            {history.length > 0 && (
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                {history.map((sp) => (
                  <div key={sp.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sp.shift.nama_shift}</p>
                      <p className="text-xs text-gray-500">
                        {sp.shift.jam_masuk} – {sp.shift.jam_keluar}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>{formatDate(sp.berlaku_dari)}</p>
                      <p>
                        {sp.berlaku_sampai ? (
                          <span>s/d {formatDate(sp.berlaku_sampai)}</span>
                        ) : (
                          <span className="font-medium text-green-600">Aktif</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
