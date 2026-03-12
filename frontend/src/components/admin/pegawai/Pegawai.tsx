'use client';

import { useState } from 'react';
import { PegawaiTable } from '@/components/admin/pegawai/PegawaiTable';
import { CreatePegawaiModal } from '@/components/admin/pegawai/CreatePegawaiModal';
import { EditPegawaiModal } from '@/components/admin/pegawai/EditPegawaiModal';
import { DeletePegawaiModal } from '@/components/admin/pegawai/DeletePegawaiModal';
import type { Pegawai } from '@/types/pegawai';

export default function Pegawai() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Pegawai | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pegawai | null>(null);

  return (
    <div className="mb-5">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Pegawai</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola data pegawai perusahaan</p>
        </div>
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

    </div>
  );
}
