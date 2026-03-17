-- CreateTable
CREATE TABLE "dexa_presensi_lokasi" (
    "id" SERIAL NOT NULL,
    "presensi_pegawai_id" INTEGER NOT NULL,
    "checkin_latitude" DOUBLE PRECISION,
    "checkin_longitude" DOUBLE PRECISION,
    "checkout_latitude" DOUBLE PRECISION,
    "checkout_longitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dexa_presensi_lokasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dexa_presensi_lokasi_presensi_pegawai_id_key" ON "dexa_presensi_lokasi"("presensi_pegawai_id");

-- AddForeignKey
ALTER TABLE "dexa_presensi_lokasi" ADD CONSTRAINT "dexa_presensi_lokasi_presensi_pegawai_id_fkey" FOREIGN KEY ("presensi_pegawai_id") REFERENCES "dexa_presensi_pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;
