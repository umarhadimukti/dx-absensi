import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Selamat Datang</h1>
      <p className="mt-2 text-gray-600">Sistem Manajemen Kehadiran Karyawan Dexa Group.</p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
      >
        Masuk ke Sistem
      </Link>
    </main>
  );
}
