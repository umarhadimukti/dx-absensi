import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateShiftDto } from "./dto/create-shift.dto";
import { UpdateShiftDto } from "./dto/update-shift.dto";

const SHIFT_SELECT = {
  id: true,
  nama_shift: true,
  jam_masuk: true,
  jam_keluar: true,
  toleransi: true,
  is_aktif: true,
  created_at: true,
  updated_at: true,
}

@Injectable()
export class ShiftRepository {
  constructor (private readonly prisma: PrismaService) {}

  findShift(skip: number, take: number, search?: string) {
    const where = search
      ? {
          OR: [
            { nama_shift: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;
    return this.prisma.db.dexa_master_shifts.findMany({
      skip,
      take,
      where,
      select: SHIFT_SELECT,
      orderBy: { nama_shift: 'asc' },
    });
  }

  countShift(search?: string) {
    const where = search
      ? {
          OR: [
            { nama_shift: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;
    return this.prisma.db.dexa_master_shifts.count({ where });
  }

  findShiftById(id: number) {
    return this.prisma.db.dexa_master_shifts.findUnique({ where: { id } });
  }

  findShiftByName(name: string) {
    return this.prisma.db.dexa_master_shifts.findUnique({ where: { nama_shift: name } });
  }

  createShift(dto: CreateShiftDto) {
    const { nama_shift, jam_masuk, jam_keluar, toleransi } = dto;
    return this.prisma.db.dexa_master_shifts.create({
      data: {
        nama_shift,
        jam_masuk,
        jam_keluar,
        toleransi,
      },
      select: SHIFT_SELECT,
    });
  }

  updateShift(id: number, dto: UpdateShiftDto) {
    const { nama_shift, jam_masuk, jam_keluar, toleransi } = dto;
    return this.prisma.db.dexa_master_shifts.update({
      where: { id },
      data: {
        nama_shift,
        jam_masuk,
        jam_keluar,
        toleransi,
      },
      select: SHIFT_SELECT,
    });
  }

  deleteShift(id: number) {
    return this.prisma.db.dexa_master_shifts.delete({ where: { id } });
  }
}