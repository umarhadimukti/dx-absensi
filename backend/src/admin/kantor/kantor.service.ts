import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AdminKantorRepository } from './kantor.repository';
import { CreateKantorDto } from './dto/create-kantor.dto';
import { UpdateKantorDto } from './dto/update-kantor.dto';
import { AdminConstant } from '../admin.constant';

@Injectable()
export class AdminKantorService {
  constructor(private readonly repo: AdminKantorRepository) {}

  async getKantor(page: number, limit: number, keyword?: string) {
    page = Math.max(page, 1);
    limit = Math.min(limit, 100);

    const skip = (page - 1) * limit;
    const cleanKeyword = keyword?.trim() || undefined;

    const [data, total] = await Promise.all([
      this.repo.findKantor(skip, limit, cleanKeyword),
      this.repo.countKantor(cleanKeyword),
    ]);

    return { data, pagination: { page, per_page: limit, total_page: Math.ceil(total / limit), total_data: total } };
  }

  async getKantorById(id: number) {
    const kantor = await this.repo.findKantorById(id);
    if (!kantor) throw new NotFoundException(AdminConstant.ERR_KANTOR_NOTFOUND);
    return kantor;
  }

  async createKantor(dto: CreateKantorDto) {
    const existing = await this.repo.findKantorByName(dto.nama);
    if (existing) throw new ConflictException(AdminConstant.ERR_NAMA_KANTOR_ALREADY_USED);

    return this.repo.createKantor(dto);
  }

  async updateKantor(id: number, dto: UpdateKantorDto) {
    const kantor = await this.repo.findKantorById(id);
    if (!kantor) throw new NotFoundException(AdminConstant.ERR_KANTOR_NOTFOUND);

    if (dto.nama && dto.nama !== kantor.nama) {
      const existing = await this.repo.findKantorByName(dto.nama);
      if (existing) throw new ConflictException(AdminConstant.ERR_NAMA_KANTOR_ALREADY_USED);
    }

    return this.repo.updateKantor(id, dto);
  }

  async deleteKantor(id: number) {
    const kantor = await this.repo.findKantorById(id);
    if (!kantor) throw new NotFoundException(AdminConstant.ERR_KANTOR_NOTFOUND);

    await this.repo.deleteKantor(id);
  }
}
