'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { PegawaiTable } from '@/components/admin/pegawai/PegawaiTable';
import { CreatePegawaiModal } from '@/components/admin/pegawai/CreatePegawaiModal';
import { EditPegawaiModal } from '@/components/admin/pegawai/EditPegawaiModal';
import { DeletePegawaiModal } from '@/components/admin/pegawai/DeletePegawaiModal';
import type { Pegawai } from '@/types/pegawai';

export default function AdminDashboardPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Pegawai | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pegawai | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Pegawai</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola data pegawai perusahaan</p>
        </div>
        <Link
          href="/presensi"
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ClipboardList size={16} />
          Presensi
        </Link>
      </div>

      <PegawaiTable
        onAdd={() => setShowCreate(true)}
        onEdit={(p) => setEditTarget(p)}
        onDelete={(p) => setDeleteTarget(p)}
      />
      <CreatePegawaiModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
      <EditPegawaiModal
        open={!!editTarget}
        pegawai={editTarget}
        onClose={() => setEditTarget(null)}
      />
      <DeletePegawaiModal
        open={!!deleteTarget}
        pegawai={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

    </main>
  );
}
