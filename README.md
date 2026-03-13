# Dexa Absensi

Sistem manajemen absensi karyawan berbasis web. Monorepo yang terdiri dari backend NestJS dan frontend Next.js.

## Struktur Proyek

```
dexa-absensi/
├── backend/          # NestJS 11 + Prisma 7 + PostgreSQL
├── frontend/         # Next.js 16 + React 19 + shadcn/ui
└── docker-compose.yml
```

## Tech Stack

| Layer      | Teknologi                                      |
|------------|------------------------------------------------|
| Backend    | NestJS 11, TypeScript, Prisma 7, PostgreSQL 16 |
| Frontend   | Next.js 16, React 19, TanStack Query v5        |
| UI         | Tailwind CSS 4, shadcn/ui (radix-nova)         |
| Auth       | JWT (access + refresh), Passport.js            |
| Deployment | Docker, Docker Compose                         |

## Fitur Utama

- **Manajemen Karyawan** — CRUD pegawai beserta departemen, jabatan, dan kontak
- **Manajemen Shift** — Definisi shift kerja dan penugasan shift per karyawan
- **Presensi** — Clock in/out dengan kamera, tracking status (HADIR, TERLAMBAT)
- **Role-Based Access** — Role ADMIN, HR, dan KARYAWAN dengan dashboard terpisah

## Skema Database

| Tabel                    | Fungsi                                        |
|--------------------------|-----------------------------------------------|
| `users`                  | Akun autentikasi (email, password, role)      |
| `dexa_pegawai`           | Profil karyawan (1:1 dengan users)            |
| `dexa_master_shifts`     | Definisi shift (jam masuk, keluar, toleransi) |
| `dexa_shift_pegawai`     | Penugasan shift per karyawan (berlaku_dari/sampai) |
| `dexa_presensi_pegawai`  | Catatan absensi harian + foto                 |
| `dexa_cuti_pegawai`      | Pengajuan dan persetujuan cuti                |

## Quick Start (Docker)

### Prasyarat

- Docker & Docker Compose
- pnpm

### Langkah

1. **Clone dan masuk ke direktori:**
   ```bash
   git clone <repo-url>
   cd dexa-absensi
   ```

2. **Siapkan environment backend:**
   ```bash
   cp backend/.env.local.example backend/.env.local
   # Edit backend/.env.local sesuai kebutuhan
   ```

3. **Jalankan semua service (PostgreSQL + backend + frontend):**
   ```bash
   cd backend
   pnpm install
   pnpm run docker:dev
   ```

4. **Jalankan migrasi dan seed database:**
   ```bash
   cd backend
   pnpm exec prisma migrate dev
   pnpm exec prisma db seed
   ```

5. **Akses aplikasi:**
   - Frontend: http://localhost:3006
   - Backend API: http://localhost:3005
   - Prisma Studio: `pnpm exec prisma studio`

### Menghentikan Service

```bash
cd backend
pnpm run docker:down
```

## Pengembangan Lokal (Tanpa Docker)

Lihat README masing-masing package:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## API Routes

| Prefix                        | Module              | Akses         |
|-------------------------------|---------------------|---------------|
| `/auth/*`                     | AuthModule          | Public        |
| `/api/v1/admin/pegawai`       | PegawaiController   | ADMIN, HR     |
| `/api/v1/admin/shift`         | ShiftController     | ADMIN         |
| `/api/v1/pegawai/presensi-pegawai` | PresensiModule | All roles     |
| `/uploads/*`                  | Static files        | Public        |

## Timezone

Semua timestamp disimpan dalam WIB (UTC+7) menggunakan `TIMESTAMP WITHOUT TIME ZONE` di PostgreSQL. Konversi dilakukan otomatis via Prisma `$extends` di `PrismaService` — tidak perlu shift manual di service layer.
