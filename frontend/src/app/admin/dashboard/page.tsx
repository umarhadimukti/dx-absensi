'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import Pegawai from '../../../components/admin/pegawai/Pegawai';
import Shift from '@/components/admin/shift/Shift';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'pegawai'| 'shift'>('pegawai');

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-100 p-1 gap-1">
          {(['pegawai', 'shift'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-6 py-1.5 text-sm font-medium transition-all cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <Link
          href="/presensi"
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ClipboardList size={16} />
          Presensi
        </Link>
      </div>

      {activeTab === 'pegawai' && (
        <Pegawai/>
      )}

      {activeTab === 'shift' && (
        <Shift/>
      )}

    </main>
  );
}
