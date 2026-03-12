'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { deleteShift } from '@/lib/shift-api';
import type { Shift } from '@/types/shift';

interface Props {
  open: boolean;
  shift: Shift | null;
  onClose: () => void;
}

export function DeleteShiftModal({ open, shift, onClose }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => deleteShift(shift!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift'] });
      onClose();
    },
  });

  if (!open || !shift) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={22} className="text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Hapus Shift</h2>
          <p className="mt-2 text-sm text-gray-500">
            Apakah Anda yakin ingin menghapus shift{' '}
            <span className="font-semibold text-gray-900">{shift.nama_shift}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
            {error.message}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
