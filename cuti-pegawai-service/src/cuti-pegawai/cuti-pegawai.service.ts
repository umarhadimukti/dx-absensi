import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterRiwayatCuti, PayloadDetailRiwayatCuti } from './cuti-pegawai.interface';
import { CutiPegawaiRepository } from './cuti-pegawai.repository';
import { CutiPegawaiConstant } from './cuti-pegawai.constant';

@Injectable()
export class CutiPegawaiService {
  constructor(private readonly repo: CutiPegawaiRepository) {}

  async getRiwayatCuti(filter: FilterRiwayatCuti) {
    const pegawai = await this.repo.findPegawaiByUserId(filter.user_id);
    if (!pegawai) throw new NotFoundException(CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND);

    const pegawaiId = pegawai.id;
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

  async detailRiwayatCuti(payload: PayloadDetailRiwayatCuti) {
    const pegawai = await this.repo.findPegawaiByUserId(payload.user_id);
    if (!pegawai) throw new NotFoundException(CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND);

    const pegawaiId = pegawai.id;
    const { cuti_id: cutiId } = payload;
    
    const detailCuti = await this.repo.findDetailRiwayatCuti(pegawaiId, cutiId);
    if (!detailCuti) throw new NotFoundException(CutiPegawaiConstant.ERR_DETAIL_CUTI_NOTFOUND);

    return detailCuti;
  }

}
