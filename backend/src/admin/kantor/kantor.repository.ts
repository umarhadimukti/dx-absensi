import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateKantorDto } from "./dto/create-kantor.dto";
import { UpdateKantorDto } from "./dto/update-kantor.dto";

const MASTER_KANTOR_SELECT = {
  id: true,
  nama: true,
  alamat: true,
  latitude: true,
  longitude: true,
  radius: true,
  created_at: true,
  updated_at: true,
}

@Injectable()
export class AdminKantorRepository {
  constructor(private readonly prisma: PrismaService) {}

  findKantor(skip: number, limit: number, keyword?: string) {
    const where = keyword
      ? {
        OR: [
          { nama: { contains: keyword, mode: 'insensitive' as const } },
          { alamat: { contains: keyword, mode: 'insensitive' as const } },
        ],
        }
      : undefined;
    return this.prisma.db.dexa_master_kantor.findMany({
      where,
      select: MASTER_KANTOR_SELECT,
      skip,
      take: limit,
      orderBy: { nama: 'asc' },
    });
  }

  countKantor(keyword?: string) {
    const where = keyword
      ? {
          OR: [
            { nama: { contains: keyword, mode: 'insensitive' as const } },
            { alamat: { contains: keyword, mode: 'insensitive' as const } },
          ],
        }
      : undefined;
    return this.prisma.db.dexa_master_kantor.count({ where })
  }

  findKantorById(id: number) {
    return this.prisma.db.dexa_master_kantor.findUnique({
      where: { id },
      select: MASTER_KANTOR_SELECT,
    });
  }

  findKantorByName(nama: string) {
    return this.prisma.db.dexa_master_kantor.findFirst({
      where: { nama: { equals: nama, mode: 'insensitive' as const } },
    });
  }

  createKantor(dto: CreateKantorDto) {
    const { nama, alamat, latitude, longitude, radius } = dto;
    return this.prisma.db.dexa_master_kantor.create({
      data: { nama, alamat, latitude, longitude, radius },
      select: MASTER_KANTOR_SELECT,
    });
  }

  updateKantor(id: number, dto: UpdateKantorDto) {
    const { nama, alamat, latitude, longitude, radius } = dto;
    return this.prisma.db.dexa_master_kantor.update({
      where: { id },
      data: { nama, alamat, latitude, longitude, radius },
      select: MASTER_KANTOR_SELECT,
    });
  }

  deleteKantor(id: number) {
    return this.prisma.db.dexa_master_kantor.delete({ where: { id } });
  }
}
