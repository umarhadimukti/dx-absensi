'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { updatePegawai } from '@/lib/pegawai-api';
import type { Pegawai, UpdatePegawaiPayload } from '@/types/pegawai';

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20';

interface Props {
  open: boolean;
  pegawai: Pegawai | null;
  onClose: () => void;
}

export function EditPegawaiModal({ open, pegawai, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UpdatePegawaiPayload>({});

  useEffect(() => {
    if (pegawai) {
      setForm({
        email: pegawai.user.email,
        role: pegawai.user.role,
        nip: pegawai.nip,
        nama: pegawai.nama,
        departemen: pegawai.departemen ?? '',
        jabatan: pegawai.jabatan ?? '',
        no_telepon: pegawai.no_telepon ?? '',
        tanggal_masuk: pegawai.tanggal_masuk
          ? pegawai.tanggal_masuk.split('T')[0]
          : '',
        is_aktif: pegawai.is_aktif,
        is_active: pegawai.user.is_active,
      });
    }
  }, [pegawai]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => updatePegawai(pegawai!.id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pegawai'] });
      onClose();
    },
  });

  function set<K extends keyof UpdatePegawaiPayload>(key: K, value: UpdatePegawaiPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate();
  }

  if (!open || !pegawai) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Edit Pegawai</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Nama</label>
              <input className={INPUT_CLASS} value={form.nama ?? ''} onChange={(e) => set('nama', e.target.value)} placeholder="Nama lengkap" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">NIP</label>
              <input className={INPUT_CLASS} value={form.nip ?? ''} onChange={(e) => set('nip', e.target.value)} placeholder="NIP" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <select className={INPUT_CLASS + ' bg-white'} value={form.role ?? 'KARYAWAN'} onChange={(e) => set('role', e.target.value as UpdatePegawaiPayload['role'])}>
                <option value="KARYAWAN">Karyawan</option>
                <option value="HR">HR</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className={INPUT_CLASS} value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="email@perusahaan.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Departemen</label>
              <input className={INPUT_CLASS} value={form.departemen ?? ''} onChange={(e) => set('departemen', e.target.value)} placeholder="Departemen" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Jabatan</label>
              <input className={INPUT_CLASS} value={form.jabatan ?? ''} onChange={(e) => set('jabatan', e.target.value)} placeholder="Jabatan" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">No. Telepon</label>
              <input className={INPUT_CLASS} value={form.no_telepon ?? ''} onChange={(e) => set('no_telepon', e.target.value)} placeholder="08xxxxxxxx" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal Masuk</label>
              <input type="date" className={INPUT_CLASS} value={form.tanggal_masuk ?? ''} onChange={(e) => set('tanggal_masuk', e.target.value)} />
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.is_aktif ?? true} onChange={(e) => set('is_aktif', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-sky-500" />
                Aktif sebagai Pegawai
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set('is_active', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-sky-500" />
                Akun Aktif
              </label>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error.message}</p>
          )}

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onClose} disabled={isPending}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50">
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
