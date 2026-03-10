-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'hr', 'karyawan');

-- CreateEnum
CREATE TYPE "StatusPresensi" AS ENUM ('HADIR', 'TERLAMBAT', 'IZIN', 'SAKIT', 'ALPHA', 'CUTI');

-- CreateEnum
CREATE TYPE "JenisCuti" AS ENUM ('TAHUNAN', 'SAKIT', 'MELAHIRKAN', 'DUKA', 'PENTING', 'LAINNYA');

-- CreateEnum
CREATE TYPE "StatusCuti" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'karyawan',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dexa_pegawai" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "departemen" TEXT,
    "jabatan" TEXT,
    "no_telepon" TEXT,
    "alamat" TEXT,
    "tanggal_masuk" TIMESTAMP(3),
    "is_aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dexa_master_shifts" (
    "id" SERIAL NOT NULL,
    "nama_shift" TEXT NOT NULL,
    "jam_masuk" TEXT NOT NULL,
    "jam_keluar" TEXT NOT NULL,
    "toleransi" INTEGER NOT NULL DEFAULT 15,
    "is_aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_master_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dexa_shift_pegawai" (
    "id" SERIAL NOT NULL,
    "pegawai_id" INTEGER NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "berlaku_dari" TIMESTAMP(3) NOT NULL,
    "berlaku_sampai" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_shift_pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dexa_presensi_pegawai" (
    "id" SERIAL NOT NULL,
    "pegawai_id" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jam_masuk" TIMESTAMP(3),
    "jam_keluar" TIMESTAMP(3),
    "status" "StatusPresensi" NOT NULL DEFAULT 'HADIR',
    "lokasi_masuk" TEXT,
    "lokasi_keluar" TEXT,
    "foto_masuk" TEXT,
    "foto_keluar" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_presensi_pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dexa_cuti_pegawai" (
    "id" SERIAL NOT NULL,
    "pegawai_id" INTEGER NOT NULL,
    "jenis_cuti" "JenisCuti" NOT NULL,
    "tanggal_dari" DATE NOT NULL,
    "tanggal_sampai" DATE NOT NULL,
    "jumlah_hari" INTEGER NOT NULL,
    "alasan" TEXT,
    "status" "StatusCuti" NOT NULL DEFAULT 'MENUNGGU',
    "disetujui_oleh" INTEGER,
    "catatan_hr" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_cuti_pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dexa_pegawai_user_id_key" ON "dexa_pegawai"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dexa_pegawai_nip_key" ON "dexa_pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "dexa_master_shifts_nama_shift_key" ON "dexa_master_shifts"("nama_shift");

-- CreateIndex
CREATE INDEX "dexa_shift_pegawai_pegawai_id_idx" ON "dexa_shift_pegawai"("pegawai_id");

-- CreateIndex
CREATE INDEX "dexa_shift_pegawai_shift_id_idx" ON "dexa_shift_pegawai"("shift_id");

-- CreateIndex
CREATE INDEX "dexa_presensi_pegawai_tanggal_idx" ON "dexa_presensi_pegawai"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "dexa_presensi_pegawai_pegawai_id_tanggal_key" ON "dexa_presensi_pegawai"("pegawai_id", "tanggal");

-- CreateIndex
CREATE INDEX "dexa_cuti_pegawai_pegawai_id_idx" ON "dexa_cuti_pegawai"("pegawai_id");

-- CreateIndex
CREATE INDEX "dexa_cuti_pegawai_tanggal_dari_tanggal_sampai_idx" ON "dexa_cuti_pegawai"("tanggal_dari", "tanggal_sampai");

-- AddForeignKey
ALTER TABLE "dexa_pegawai" ADD CONSTRAINT "dexa_pegawai_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dexa_shift_pegawai" ADD CONSTRAINT "dexa_shift_pegawai_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "dexa_pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dexa_shift_pegawai" ADD CONSTRAINT "dexa_shift_pegawai_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "dexa_master_shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dexa_presensi_pegawai" ADD CONSTRAINT "dexa_presensi_pegawai_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "dexa_pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dexa_cuti_pegawai" ADD CONSTRAINT "dexa_cuti_pegawai_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "dexa_pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;
