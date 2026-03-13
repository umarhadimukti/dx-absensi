import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

const PRESENSI_SELECT = {
  id: true,
  tanggal: true,
  jam_masuk: true,
  jam_keluar: true,
  status: true,
  lokasi_masuk: true,
  lokasi_keluar: true,
  foto_masuk: true,
  foto_keluar: true,
  keterangan: true,
  created_at: true,
  updated_at: true,
  pegawai: {
    select: { id: true, nip: true, nama: true },
  },
};

@Injectable()
export class PresensiPegawaiRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPegawaiByUserId(userId: number) {
    return this.prisma.db.dexa_pegawai.findUnique({ where: { user_id: userId } });
  }

  findPegawaiWithUserByUserId(userId: number) {
    return this.prisma.db.dexa_pegawai.findUnique({
      where: { user_id: userId },
      include: { user: { select: { email: true } } },
    });
  }

  findPresensiByPegawaiAndDate(pegawaiId: number, tanggal: Date) {
    return this.prisma.db.dexa_presensi_pegawai.findUnique({
      where: { pegawai_id_tanggal: { pegawai_id: pegawaiId, tanggal } },
      select: PRESENSI_SELECT,
    });
  }

  findActiveShiftForDate(pegawaiId: number, tanggal: Date) {
    return this.prisma.db.dexa_shift_pegawai.findFirst({
      where: {
        pegawai_id: pegawaiId,
        berlaku_dari: { lte: tanggal },
        OR: [
          { berlaku_sampai: null },
          { berlaku_sampai: { gte: tanggal } },
        ],
      },
      include: { shift: true },
      orderBy: { berlaku_dari: 'desc' },
    });
  }

  createPresensiMasuk(data: {
    pegawai_id: number;
    tanggal: Date;
    jam_masuk: Date;
    status: 'HADIR' | 'TERLAMBAT';
    foto_masuk: string;
    lokasi_masuk?: string;
    keterangan?: string;
  }) {
    return this.prisma.db.dexa_presensi_pegawai.create({
      data,
      select: PRESENSI_SELECT,
    });
  }

  updatePresensiKeluar(id: number, data: {
    jam_keluar: Date;
    foto_keluar: string;
    lokasi_keluar?: string;
  }) {
    return this.prisma.db.dexa_presensi_pegawai.update({
      where: { id },
      data,
      select: PRESENSI_SELECT,
    });
  }
}
