import { Injectable } from "@nestjs/common";
import { PayloadRiwayatCuti } from "./cuti-pegawai.interface";
import { PrismaService } from "src/database/prisma.service";
import { Prisma } from "generated/client";

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
}