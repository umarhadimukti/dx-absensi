'use client';

import { useState } from 'react';
import { ShiftTable } from './ShiftTable';
import { CreateShiftModal } from './CreateShiftModal';
import { EditShiftModal } from './EditShiftModal';
import { DeleteShiftModal } from './DeleteShiftModal';
import type { Shift } from '@/types/shift';

export default function ShiftManager() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Shift | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Shift</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola data shift pegawai</p>
        </div>
      </div>
      
      <ShiftTable
        onAdd={() => setShowCreate(true)}
        onEdit={(s) => setEditTarget(s)}
        onDelete={(s) => setDeleteTarget(s)}
      />
      <CreateShiftModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
      <EditShiftModal
        open={!!editTarget}
        shift={editTarget}
        onClose={() => setEditTarget(null)}
      />
      <DeleteShiftModal
        open={!!deleteTarget}
        shift={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
