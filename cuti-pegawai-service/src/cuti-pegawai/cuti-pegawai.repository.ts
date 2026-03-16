import { Injectable } from "@nestjs/common";
import { PayloadInsertCuti, PayloadRiwayatCuti, PayloadUpdateCuti } from "./cuti-pegawai.interface";
import { PrismaService } from "src/database/prisma.service";
import { Prisma, StatusCuti } from "generated/client";

const PEGAWAI_SELECT = {
  id: true,
  nip: true,
  nama: true,
  departemen: true,
  jabatan: true,
  no_telepon: true,
  alamat: true,
  tanggal_masuk: true,
  is_aktif: true,
  created_at: true,
  updated_at: true,
  users: {
    select: { id: true, email: true, role: true },
  } as const,
}

const CUTI_PEGAWAI_SELECT = {
  id: true,
  dexa_pegawai: { select: { id: true, nama: true, departemen: true } },
  jenis_cuti: true,
  tanggal_dari: true,
  tanggal_sampai: true,
  jumlah_hari: true,
  alasan: true,
  status: true,
  disetujui_oleh: true,
  catatan_hr: true,
  created_at: true,
  updated_at: true,
}

@Injectable()
export class CutiPegawaiRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPegawaiByUserId(userId: number) {
    return this.prisma.db.dexa_pegawai.findUnique({
      where: { user_id: userId },
      select: PEGAWAI_SELECT,
    });
  }

  findRiwayatCutiByPegawaiId(pegawaiId: number, payload: PayloadRiwayatCuti) {
    const { skip, limit, keyword } = payload;
    const where = {
      pegawai_id: pegawaiId,
      ...(keyword && {
        OR: [
          { alasan: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };
    return this.prisma.db.dexa_cuti_pegawai.findMany({
      where,
      select: CUTI_PEGAWAI_SELECT,
      orderBy: [{ updated_at: 'desc' }, { id: 'asc' }],
      skip,
      take: limit,
    });
  }

  countRiwayatCutiByPegawaiId(pegawaiId: number, keyword?: string) {
    const where = {
      pegawai_id: pegawaiId,
      ...(keyword && {
        OR: [
          { alasan: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };
    return this.prisma.db.dexa_cuti_pegawai.count({ where });
  }

  findDetailRiwayatCuti(pegawaiId: number, cutiId: number) {
    return this.prisma.db.dexa_cuti_pegawai.findFirst({
      where: {
        id: cutiId,
        pegawai_id: pegawaiId,
      },
      select: CUTI_PEGAWAI_SELECT,
    });
  }

  insertCuti(pegawaiId: number, payload: PayloadInsertCuti) {
    const tanggalDari = new Date(payload.tanggal_dari);
    const tanggalSampai = new Date(payload.tanggal_sampai);

    const diffTime = Math.abs(tanggalSampai.getTime() - tanggalDari.getTime());

    const jumlahHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return this.prisma.db.dexa_cuti_pegawai.create({
      data: {
        pegawai_id: pegawaiId,
        jenis_cuti: payload.jenis_cuti,
        tanggal_dari: tanggalDari,
        tanggal_sampai: tanggalSampai,
        jumlah_hari: jumlahHari,
        alasan: payload.alasan,
        status: StatusCuti.MENUNGGU,
        updated_at: new Date(),
      },
      select: CUTI_PEGAWAI_SELECT,
    });
  }

  findCutiByPegawaiIdAndCutiId(pegawaiId: number, cutiId: number) {
    return this.prisma.db.dexa_cuti_pegawai.findFirst({
      where: {
        id: cutiId,
        pegawai_id: pegawaiId,
      },
      select: CUTI_PEGAWAI_SELECT,
    });
  }

  updateCuti(pegawaiId: number, payload: PayloadUpdateCuti) {
    const tanggalDari = new Date(payload.tanggal_dari);
    const tanggalSampai = new Date(payload.tanggal_sampai);
    const diffTime = Math.abs(tanggalSampai.getTime() - tanggalDari.getTime());
    const jumlahHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return this.prisma.db.dexa_cuti_pegawai.update({
      where: { id: payload.cuti_id },
      data: {
        pegawai_id: pegawaiId,
        jenis_cuti: payload.jenis_cuti,
        tanggal_dari: tanggalDari,
        tanggal_sampai: tanggalSampai,
        jumlah_hari: jumlahHari,
        alasan: payload.alasan,
        updated_at: new Date(),
      },
      select: CUTI_PEGAWAI_SELECT,
    });
  }

  cancelCuti(cutiId: number) {
    return this.prisma.db.dexa_cuti_pegawai.update({
      where: { id: cutiId },
      data: {
        status: StatusCuti.DIBATALKAN,
        updated_at: new Date(),
      },
      select: CUTI_PEGAWAI_SELECT,
    });
  }
}