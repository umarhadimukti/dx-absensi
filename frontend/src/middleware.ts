import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  KARYAWAN: '/presensi',
};

const PROTECTED: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/presensi': ['KARYAWAN'],
};

function decodeJwt(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(padded));
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  const payload = token ? decodeJwt(token) : null;
  const role = payload?.role as string | undefined;

  // Sudah login -> redirect dari /login ke dashboard sesuai role
  if (pathname === '/login') {
    if (role && ROLE_REDIRECT[role]) {
      return NextResponse.redirect(new URL(ROLE_REDIRECT[role], request.url));
    }
    return NextResponse.next();
  }

  // Cek akses ke route yang dilindungi
  for (const [prefix, allowed] of Object.entries(PROTECTED)) {
    if (pathname.startsWith(prefix)) {
      if (!role || !allowed.includes(role)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/presensi/:path*'],
};
