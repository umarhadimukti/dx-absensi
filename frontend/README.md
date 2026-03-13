# Frontend — Dexa Absensi

Antarmuka web untuk sistem manajemen absensi karyawan, dibangun dengan Next.js 16 dan React 19.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4, shadcn/ui (style: radix-nova), Radix UI
- **Data Fetching:** TanStack React Query v5
- **Font:** Geist
- **Package manager:** pnpm

## Prasyarat

- Node.js >= 20
- pnpm
- Backend berjalan di port 3005 (lihat [backend/README.md](../backend/README.md))

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Konfigurasi environment

Buat file `.env.local` di direktori `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3005
```

## Menjalankan Aplikasi

### Development

```bash
pnpm run dev
```

Aplikasi berjalan di `http://localhost:3006`.

### Production

```bash
pnpm run build
pnpm run start
```

### Linting

```bash
pnpm run lint
```

## Halaman

| Route              | Akses      | Keterangan                                        |
|--------------------|------------|---------------------------------------------------|
| `/login`           | Public     | Form login                                        |
| `/admin/dashboard` | ADMIN      | Manajemen pegawai, shift, dan riwayat presensi    |
| `/presensi`        | Semua role | Clock in/out dengan kamera                        |

## Arsitektur

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Server Component)
│   ├── login/                  # Halaman login
│   ├── admin/dashboard/        # Dashboard admin
│   └── presensi/               # Halaman presensi
│
├── components/
│   ├── layout/                 # Header (Server) + HeaderNav (Client)
│   ├── admin/
│   │   ├── pegawai/            # CRUD pegawai + assign shift
│   │   ├── shift/              # CRUD master shift
│   │   └── presensi/           # Riwayat presensi + detail foto
│   ├── presensi/               # Modal kamera presensi
│   └── ui/                     # shadcn/ui components
│
├── lib/
│   ├── api.ts                  # Base fetcher apiFetch<T>()
│   ├── pegawai-api.ts          # Endpoint pegawai & presensi admin
│   ├── shift-api.ts            # Endpoint master shift
│   └── presensi-api.ts         # Endpoint presensi karyawan
│
├── hooks/
│   └── useAuth.ts              # Query /auth/me, return null saat tidak login
│
├── providers/
│   └── query-provider.tsx      # React Query setup
│
├── types/                      # TypeScript interfaces
└── middleware.ts               # Edge Runtime: JWT validation + redirect
```

### Data Fetching

Semua request ke backend melalui `apiFetch<T>(path, init?)` di `lib/api.ts`:
- Otomatis menyisipkan `Authorization: Bearer <token>` dari localStorage
- `credentials: 'include'` untuk cookie
- Upload foto (masuk/keluar) menggunakan raw `fetch` dengan `FormData` karena `apiFetch` set `Content-Type: application/json`

**Query keys yang digunakan:**

| Query Key                      | Data                          |
|--------------------------------|-------------------------------|
| `['auth', 'me']`               | User yang sedang login        |
| `['pegawai', page, search]`    | List karyawan                 |
| `['shift']`                    | List master shift             |
| `['shift-pegawai', id]`        | Riwayat shift satu karyawan   |
| `['presensi', 'today']`        | Status presensi hari ini      |
| `['riwayat-presensi', ...]`    | Riwayat presensi admin        |

### Auth

- JWT disimpan di **dua tempat** secara bersamaan:
  - `localStorage` (`access_token`) — untuk header `Authorization` di API call
  - `document.cookie` (`access_token`) — untuk validasi di Next.js middleware (Edge Runtime)
- Setelah login: set keduanya, invalidate query `['auth', 'me']`
- Setelah logout: panggil `/auth/logout`, set query data `['auth', 'me']` ke `null` untuk update UI langsung
- Komponen yang membaca `localStorage` menggunakan pola `mounted` state untuk menghindari hydration mismatch

### Middleware

`src/middleware.ts` berjalan di Edge Runtime dan:
- Membaca JWT dari cookie `access_token` (pure base64url, tanpa library)
- `/login` + token valid → redirect ke dashboard sesuai role
- `/admin/*` → wajib role ADMIN
- `/presensi/*` → semua role yang terautentikasi

### Timezone

Timestamp dari backend sudah dalam WIB (UTC+7) yang disimpan seolah UTC. Saat menampilkan di frontend selalu gunakan `timeZone: 'UTC'`. Hanya gunakan `timeZone: 'Asia/Jakarta'` untuk waktu lokal dari `new Date()`.

## Variabel Environment

| Key                   | Default                 | Keterangan      |
|-----------------------|-------------------------|-----------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3005` | URL backend API |
