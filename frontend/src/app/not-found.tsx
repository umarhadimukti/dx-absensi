import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-32 text-center">
      <span className="text-8xl font-bold text-sky-500">404</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-gray-500">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors hover:underline"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
