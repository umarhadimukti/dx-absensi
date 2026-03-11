import Link from 'next/link';
import { HeaderNav } from './HeaderNav';

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          Dexa Absensi
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
