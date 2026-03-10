import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { AdminRepository } from './admin.repository';
import type { CreatePegawaiDto } from './dto/create-pegawai.dto';
import type { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { AdminConstant } from './admin.constant';

@Injectable()
export class AdminService {
  constructor(private readonly repo: AdminRepository) {}

  async getPegawai(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.repo.findPegawai(skip, limit, search),
      this.repo.countPegawai(search),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getPegawaiById(id: number) {
    const pegawai = await this.repo.findPegawaiById(id);
    if (!pegawai) throw new NotFoundException(AdminConstant.ERR_PEGAWAI_NOTFOUND);
    return pegawai;
  }

  async createPegawai(dto: CreatePegawaiDto) {
    const [existingEmail, existingNip] = await Promise.all([
      this.repo.findUserByEmail(dto.email),
      this.repo.findPegawaiByNip(dto.nip),
    ]);
    if (existingEmail) throw new ConflictException(AdminConstant.ERR_EMAIL_ALREADY_USED);
    if (existingNip) throw new ConflictException(AdminConstant.ERR_NIP_ALREADY_USED);

    const hashedPassword = await hash(dto.password, 10);
    const result = await this.repo.createPegawai(hashedPassword, dto);
    return result.pegawai;
  }

  async updatePegawai(id: number, dto: UpdatePegawaiDto) {
    const pegawai = await this.repo.findPegawaiById(id);
    if (!pegawai) throw new NotFoundException(AdminConstant.ERR_PEGAWAI_NOTFOUND);

    if (dto.email && dto.email !== pegawai.user.email) {
      const existing = await this.repo.findUserByEmail(dto.email);
      if (existing) throw new ConflictException(AdminConstant.ERR_EMAIL_ALREADY_USED);
    }

    if (dto.nip && dto.nip !== pegawai.nip) {
      const existing = await this.repo.findPegawaiByNip(dto.nip);
      if (existing) throw new ConflictException(AdminConstant.ERR_NIP_ALREADY_USED);
    }

    return this.repo.updatePegawai(id, dto);
  }

  async deletePegawai(id: number) {
    const pegawai = await this.repo.findPegawaiById(id);
    if (!pegawai) throw new NotFoundException(AdminConstant.ERR_PEGAWAI_NOTFOUND);
    await this.repo.deletePegawai(pegawai.user.id);
  }
}
