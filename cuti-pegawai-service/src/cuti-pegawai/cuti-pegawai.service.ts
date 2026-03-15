import { Injectable } from '@nestjs/common';
import { FilterRiwayatCuti } from './cuti-pegawai.interface';
import { CutiPegawaiRepository } from './cuti-pegawai.repository';

@Injectable()
export class CutiPegawaiService {
  constructor(private readonly repo: CutiPegawaiRepository) {}

  async getRiwayatCuti(filter: FilterRiwayatCuti) {
    const pegawaiId = filter.pegawai_id;
    const page = filter.page;
    const limit = Math.min(filter.limit, 100);
    const skip = (page - 1) * limit;
    const keyword = filter.keyword || undefined;

    const payload = { limit, skip, keyword };

    const [data, total] = await Promise.all([
      this.repo.findRiwayatCutiByPegawaiId(pegawaiId, payload),
      this.repo.countRiwayatCutiByPegawaiId(pegawaiId, keyword),
    ]);

    return {
      list: data,
      pagination: {
        page,
        per_page: limit,
        total_data: total,
        total_page: Math.ceil(total / limit) || 1,
      },
    };
  }

}
