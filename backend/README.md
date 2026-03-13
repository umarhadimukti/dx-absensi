# Backend — Dexa Absensi

REST API untuk sistem manajemen absensi karyawan, dibangun dengan NestJS 11 dan Prisma 7.

## Tech Stack

- **Framework:** NestJS 11, TypeScript 5.7
- **ORM:** Prisma 7 + `@prisma/adapter-pg`
- **Database:** PostgreSQL 16
- **Auth:** JWT (access + refresh token), Passport.js, bcryptjs
- **Logging:** nestjs-pino (pretty-printed di dev, JSON di production)
- **Upload:** Multer 2
- **Package manager:** pnpm

## Prasyarat

- Node.js >= 20
- pnpm
- PostgreSQL (atau Docker)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Konfigurasi environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
APP_NAME=dexa-absensi
APP_HOST=localhost
APP_PORT=3005
APP_ENV=development

POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=db-absensi
POSTGRES_PORT=5435
DATABASE_URL=postgresql://postgres:password@localhost:5435/db-absensi

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Jalankan migrasi dan seed

```bash
pnpm exec prisma migrate dev
pnpm exec prisma db seed
```

## Menjalankan Aplikasi

### Development (dengan hot reload)

```bash
pnpm run start:dev
```

Server berjalan di `http://localhost:3005`.

### Production

```bash
pnpm run build
pnpm run start:prod
```

### Docker (PostgreSQL + backend)

```bash
# Dari direktori backend/
pnpm run docker:dev    # Build dan jalankan semua service + tampilkan log
pnpm run docker:down   # Hentikan semua service
```

## Prisma

```bash
pnpm exec prisma migrate dev      # Buat dan jalankan migrasi baru
pnpm exec prisma db seed          # Isi data awal
pnpm exec prisma generate         # Regenerate client setelah ubah schema
pnpm exec prisma studio           # Buka Prisma Studio (GUI)
```

> Prisma membaca `.env.local` via `prisma.config.ts`. Client di-generate ke `generated/prisma/`, bukan `node_modules/.prisma`.

## Testing

```bash
pnpm run test                                           # Unit test
pnpm run test:cov                                       # Unit test + coverage
pnpm run test:e2e                                       # E2E test
pnpm run test -- --testPathPattern=admin.controller     # Test file tertentu
```

## Linting

```bash
pnpm run lint    # ESLint dengan auto-fix
```

## Arsitektur

```
src/
├── main.ts                         # Bootstrap: pino, versioning, ValidationPipe
├── app.module.ts                   # Root module
├── database/                       # PrismaService (global)
├── common/
│   ├── interceptors/               # TransformInterceptor — wrap semua response
│   ├── utils/datetime.ts           # WIB helpers (wibToday, WIB_OFFSET_MS)
│   └── jwt/                        # JwtUtil + JwtModule
├── auth/                           # Autentikasi (local, jwt, jwt-refresh)
├── admin/                          # Manajemen pegawai & shift
│   └── shift/                      # Sub-module shift
└── presensi-pegawai/               # Presensi karyawan (masuk/keluar/today)
```

### Response Format

Semua response dibungkus oleh `TransformInterceptor`:

```json
{
  "statusCode": 200,
  "message": "Berhasil",
  "data": { ... }
}
```

## API Endpoints

### Auth (`/auth`)

| Method | Path             | Guard           | Keterangan           |
|--------|------------------|-----------------|----------------------|
| POST   | `/auth/login`    | LocalAuthGuard  | Login, dapat JWT     |
| POST   | `/auth/refresh`  | JwtRefreshGuard | Refresh access token |
| POST   | `/auth/logout`   | JwtAuthGuard    | Logout, hapus cookie |
| GET    | `/auth/me`       | JwtAuthGuard    | Data user saat ini   |

### Admin — Pegawai (`/api/v1/admin/pegawai`)

| Method | Path                          | Role      | Keterangan                      |
|--------|-------------------------------|-----------|---------------------------------|
| GET    | `/pegawai`                    | ADMIN, HR | List pegawai (page, search)     |
| GET    | `/pegawai/riwayat-presensi`   | ADMIN, HR | Riwayat presensi semua pegawai  |
| GET    | `/pegawai/:id`                | ADMIN, HR | Detail pegawai                  |
| POST   | `/pegawai`                    | ADMIN     | Buat pegawai baru               |
| PATCH  | `/pegawai/:id`                | ADMIN     | Update pegawai                  |
| DELETE | `/pegawai/:id`                | ADMIN     | Hapus pegawai                   |
| GET    | `/pegawai/:id/shift`          | ADMIN, HR | Riwayat shift pegawai           |
| POST   | `/pegawai/:id/assign-shift`   | ADMIN, HR | Tugaskan shift ke pegawai       |

### Admin — Shift (`/api/v1/admin/shift`)

| Method | Path         | Role  | Keterangan      |
|--------|--------------|-------|-----------------|
| GET    | `/shift`     | ADMIN | List shift      |
| GET    | `/shift/:id` | ADMIN | Detail shift    |
| POST   | `/shift`     | ADMIN | Buat shift baru |
| PATCH  | `/shift/:id` | ADMIN | Update shift    |
| DELETE | `/shift/:id` | ADMIN | Hapus shift     |

### Presensi Pegawai (`/api/v1/pegawai/presensi-pegawai`)

| Method | Path                      | Keterangan                                 |
|--------|---------------------------|--------------------------------------------|
| GET    | `/presensi-pegawai/today` | Status presensi hari ini + shift aktif     |
| POST   | `/presensi-pegawai/masuk` | Clock in (multipart: field `foto`)         |
| POST   | `/presensi-pegawai/keluar`| Clock out (multipart: field `foto`)        |

### Static Files

Upload foto diakses via: `GET /uploads/<filename>`

## Variabel Environment

| Key                      | Default       | Keterangan                          |
|--------------------------|---------------|-------------------------------------|
| `APP_PORT`               | `3005`        | Port server                         |
| `APP_ENV`                | `development` | `production` untuk JSON logging     |
| `DATABASE_URL`           | —             | PostgreSQL connection string        |
| `JWT_ACCESS_SECRET`      | —             | Secret untuk access token           |
| `JWT_REFRESH_SECRET`     | —             | Secret untuk refresh token          |
| `JWT_ACCESS_EXPIRES_IN`  | `15m`         | TTL access token                    |
| `JWT_REFRESH_EXPIRES_IN` | `7d`          | TTL refresh token (httpOnly cookie) |
