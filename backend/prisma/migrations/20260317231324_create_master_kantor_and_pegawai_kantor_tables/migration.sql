/*
  Warnings:

  - You are about to drop the column `checkin_latitude` on the `dexa_presensi_lokasi` table. All the data in the column will be lost.
  - You are about to drop the column `checkin_longitude` on the `dexa_presensi_lokasi` table. All the data in the column will be lost.
  - You are about to drop the column `checkout_latitude` on the `dexa_presensi_lokasi` table. All the data in the column will be lost.
  - You are about to drop the column `checkout_longitude` on the `dexa_presensi_lokasi` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `dexa_presensi_lokasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `dexa_presensi_lokasi` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PresensiType" AS ENUM ('CHECKIN', 'CHECKOUT');

-- AlterTable
ALTER TABLE "dexa_presensi_lokasi" DROP COLUMN "checkin_latitude",
DROP COLUMN "checkin_longitude",
DROP COLUMN "checkout_latitude",
DROP COLUMN "checkout_longitude",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "presensi_type" "PresensiType" NOT NULL DEFAULT 'CHECKIN';

-- CreateTable
CREATE TABLE "dexa_master_kantor" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL DEFAULT 200,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_master_kantor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dexa_pegawai_kantor" (
    "id" SERIAL NOT NULL,
    "pegawai_id" INTEGER NOT NULL,
    "kantor_id" INTEGER NOT NULL,
    "is_aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_pegawai_kantor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dexa_pegawai_kantor" ADD CONSTRAINT "dexa_pegawai_kantor_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "dexa_pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dexa_pegawai_kantor" ADD CONSTRAINT "dexa_pegawai_kantor_kantor_id_fkey" FOREIGN KEY ("kantor_id") REFERENCES "dexa_master_kantor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
