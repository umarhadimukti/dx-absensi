import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ShiftRepository } from './shift.repository';
import { CreateShiftDto } from './dto/create-shift.dto';
import { AdminConstant } from '../admin.constant';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepo: ShiftRepository) {}

  async getShift(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total_data] = await Promise.all([
      this.shiftRepo.findShift(skip, limit, search),
      this.shiftRepo.countShift(search),
    ]);
    return { data, pagination: { page, limit, total_data, total_page: Math.ceil(total_data / limit) } }
  }

  async getShiftById(id: number) {
    const shift = await this.shiftRepo.findShiftById(id);
    if (!shift) throw new NotFoundException(AdminConstant.ERR_SHIFT_NOTFOUND);

    return shift;
  }

  async createShift(dto: CreateShiftDto) {
    const existingShift = await this.shiftRepo.findShiftByName(dto.nama_shift)
    if (existingShift) throw new ConflictException(AdminConstant.ERR_NAMA_SHIFT_ALREADY_USED);

    const result = await this.shiftRepo.createShift(dto)
    return result
  }

  async updateShift(id: number, dto: UpdateShiftDto) {
    const shift = await this.shiftRepo.findShiftById(id);
    if (!shift) throw new NotFoundException(AdminConstant.ERR_SHIFT_NOTFOUND);

    if (dto.nama_shift && dto.nama_shift !== shift.nama_shift) {
      const existing = await this.shiftRepo.findShiftByName(dto.nama_shift);
      if (existing) throw new ConflictException(AdminConstant.ERR_NAMA_SHIFT_ALREADY_USED);
    }

    return await this.shiftRepo.updateShift(id, dto);
  }

  async deleteShift(id: number) {
    const shift = await this.shiftRepo.findShiftById(id);
    if (!shift) throw new NotFoundException(AdminConstant.ERR_SHIFT_NOTFOUND);

    await this.shiftRepo.deleteShift(id);
  }
}
