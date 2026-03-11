import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { CreatePegawaiDto } from './dto/create-pegawai.dto';
import type { UpdatePegawaiDto } from './dto/update-pegawai.dto';

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
  user: {
    select: { id: true, email: true, role: true, is_active: true },
  },
};

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPegawai(skip: number, take: number, search?: string) {
    const where = search
      ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' as const } },
            { nip: { contains: search, mode: 'insensitive' as const } },
            { departemen: { contains: search, mode: 'insensitive' as const } },
            { jabatan: { contains: search, mode: 'insensitive' as const } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : undefined;

    return this.prisma.db.dexa_pegawai.findMany({
      skip,
      take,
      where,
      select: PEGAWAI_SELECT,
      orderBy: { nama: 'asc' },
    });
  }

  countPegawai(search?: string) {
    const where = search
      ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' as const } },
            { nip: { contains: search, mode: 'insensitive' as const } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : undefined;

    return this.prisma.db.dexa_pegawai.count({ where });
  }

  findPegawaiById(id: number) {
    return this.prisma.db.dexa_pegawai.findUnique({
      where: { id },
      select: PEGAWAI_SELECT,
    });
  }

  findPegawaiByNip(nip: string) {
    return this.prisma.db.dexa_pegawai.findUnique({ where: { nip } });
  }

  findUserByEmail(email: string) {
    return this.prisma.db.users.findUnique({ where: { email } });
  }

  createPegawai(hashedPassword: string, dto: CreatePegawaiDto) {
    const { email, role, nip, nama, departemen, jabatan, no_telepon, alamat, tanggal_masuk } = dto;
    return this.prisma.db.users.create({
      data: {
        email,
        password: hashedPassword,
        role: role ?? 'KARYAWAN',
        pegawai: {
          create: {
            nip,
            nama,
            departemen,
            jabatan,
            no_telepon,
            alamat,
            tanggal_masuk: tanggal_masuk ? new Date(tanggal_masuk) : undefined,
          },
        },
      },
      select: {
        pegawai: { select: PEGAWAI_SELECT },
      },
    });
  }

  updatePegawai(id: number, dto: UpdatePegawaiDto) {
    const { email, role, is_active, nip, nama, departemen, jabatan, no_telepon, alamat, tanggal_masuk, is_aktif } = dto;

    const userUpdate = email || role !== undefined || is_active !== undefined
      ? { update: { email, role, is_active } }
      : undefined;

    return this.prisma.db.dexa_pegawai.update({
      where: { id },
      data: {
        nip,
        nama,
        departemen,
        jabatan,
        no_telepon,
        alamat,
        tanggal_masuk: tanggal_masuk ? new Date(tanggal_masuk) : undefined,
        is_aktif,
        user: userUpdate,
      },
      select: PEGAWAI_SELECT,
    });
  }

  // Delete user -> cascade ke pegawai
  deletePegawai(userId: number) {
    return this.prisma.db.users.delete({ where: { id: userId } })
  }

  findShiftPegawai(pegawaiId: number) {
    return this.prisma.db.dexa_shift_pegawai.findMany({
      where: { pegawai_id: pegawaiId },
      select: {
        id: true,
        berlaku_dari: true,
        berlaku_sampai: true,
        created_at: true,
        shift: {
          select: { id: true, nama_shift: true, jam_masuk: true, jam_keluar: true, toleransi: true },
        },
      },
      orderBy: { berlaku_dari: 'desc' },
    });
  }

  findActiveShiftPegawai(pegawaiId: number) {
    return this.prisma.db.dexa_shift_pegawai.findFirst({
      where: { pegawai_id: pegawaiId, berlaku_sampai: null },
      orderBy: { berlaku_dari: 'desc' },
    });
  }

  closeShiftPegawai(id: number, berlaku_sampai: Date) {
    return this.prisma.db.dexa_shift_pegawai.update({
      where: { id },
      data: { berlaku_sampai },
    });
  }

  createShiftPegawai(pegawaiId: number, shiftId: number, berlakuDari: Date, berlakuSampai?: Date) {
    return this.prisma.db.dexa_shift_pegawai.create({
      data: {
        pegawai_id: pegawaiId,
        shift_id: shiftId,
        berlaku_dari: berlakuDari,
        berlaku_sampai: berlakuSampai,
      },
      select: {
        id: true,
        berlaku_dari: true,
        berlaku_sampai: true,
        created_at: true,
        pegawai: {
          select: { id: true, nip: true, nama: true },
        },
        shift: {
          select: { id: true, nama_shift: true, jam_masuk: true, jam_keluar: true, toleransi: true },
        },
      },
    });
  }
}
