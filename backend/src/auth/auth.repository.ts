import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.db.users.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.db.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        pegawai: {
          select: {
            nip: true,
            nama: true,
            departemen: true,
            jabatan: true,
          },
        },
      },
    });
  }
}
