import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { AdminRepository } from './admin.repository';
import { ShiftRepository } from './shift/shift.repository';
import type { CreatePegawaiDto } from './dto/create-pegawai.dto';
import type { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import type { AssignShiftPegawaiDto } from './dto/assign-shift-pegawai.dto';
import { AdminConstant } from './admin.constant';

@Injectable()
export class AdminService {
  constructor(
    private readonly repo: AdminRepository,
    private readonly shiftRepo: ShiftRepository,
  ) {}

  async getPegawai(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total_data] = await Promise.all([
      this.repo.findPegawai(skip, limit, search),
      this.repo.countPegawai(search),
    ]);
    return { data, pagination: { page, limit, total_data, total_page: Math.ceil(total_data / limit) } };
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

  async getShiftPegawai(pegawaiId: number) {
    const pegawai = await this.repo.findPegawaiById(pegawaiId);
    if (!pegawai) throw new NotFoundException(AdminConstant.ERR_PEGAWAI_NOTFOUND);
    return this.repo.findShiftPegawai(pegawaiId);
  }

  async assignShiftPegawai(pegawaiId: number, dto: AssignShiftPegawaiDto) {
    const berlakuDari = new Date(dto.berlaku_dari);
    const berlakuSampai = dto.berlaku_sampai ? new Date(dto.berlaku_sampai) : undefined;

    if (berlakuSampai && berlakuSampai < berlakuDari) {
      throw new BadRequestException(AdminConstant.ERR_SHIFT_PEGAWAI_DATE_INVALID);
    }

    const [pegawai, shift] = await Promise.all([
      this.repo.findPegawaiById(pegawaiId),
      this.shiftRepo.findShiftById(dto.shift_id),
    ]);
    if (!pegawai) throw new NotFoundException(AdminConstant.ERR_PEGAWAI_NOTFOUND);
    if (!shift) throw new NotFoundException(AdminConstant.ERR_SHIFT_NOTFOUND);

    // Close active shift (berlaku_sampai IS NULL) — set berlaku_sampai to day before new berlaku_dari
    const activeShift = await this.repo.findActiveShiftPegawai(pegawaiId);
    if (activeShift) {
      const closeDate = new Date(berlakuDari);
      closeDate.setDate(closeDate.getDate() - 1);
      await this.repo.closeShiftPegawai(activeShift.id, closeDate);
    }

    return this.repo.createShiftPegawai(pegawaiId, dto.shift_id, berlakuDari, berlakuSampai);
  }
}
