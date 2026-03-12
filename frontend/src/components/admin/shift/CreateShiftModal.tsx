'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { createShift } from '@/lib/shift-api';
import type { CreateShiftPayload } from '@/types/shift';

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20';

const EMPTY: CreateShiftPayload = {
  nama_shift: '',
  jam_masuk: '',
  jam_keluar: '',
  toleransi: 0,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateShiftModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateShiftPayload>(EMPTY);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => createShift(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift'] });
      setForm(EMPTY);
      onClose();
    },
  });

  function set(key: keyof CreateShiftPayload, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl mx-4">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Tambah Shift</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama Shift <span className="text-red-500">*</span>
              </label>
              <input
                className={INPUT_CLASS}
                value={form.nama_shift}
                onChange={(e) => set('nama_shift', e.target.value)}
                placeholder="Contoh: WFO Pagi"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Jam Masuk <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className={INPUT_CLASS}
                value={form.jam_masuk}
                onChange={(e) => set('jam_masuk', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Jam Keluar <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className={INPUT_CLASS}
                value={form.jam_keluar}
                onChange={(e) => set('jam_keluar', e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Toleransi (menit) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                className={INPUT_CLASS}
                value={form.toleransi}
                onChange={(e) => set('toleransi', Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error.message}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
