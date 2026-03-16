import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  FilterRiwayatCuti,
  PayloadCancelCuti,
  PayloadDetailRiwayatCuti,
  PayloadInsertCuti,
  PayloadUpdateCuti,
} from './cuti-pegawai.interface';
import { CutiPegawaiRepository } from './cuti-pegawai.repository';
import { CutiPegawaiConstant } from './cuti-pegawai.constant';
import { StatusCuti } from 'generated/client';

@Injectable()
export class CutiPegawaiService {
  constructor(private readonly repo: CutiPegawaiRepository) {}

  async getRiwayatCuti(filter: FilterRiwayatCuti) {
    const pegawai = await this.repo.findPegawaiByUserId(filter.user_id);
    if (!pegawai) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND });

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
    if (!pegawai) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND });

    const pegawaiId = pegawai.id;
    const { cuti_id: cutiId } = payload;

    const detailCuti = await this.repo.findDetailRiwayatCuti(pegawaiId, cutiId);
    if (!detailCuti) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_DETAIL_CUTI_NOTFOUND });

    return detailCuti;
  }

  async insertCuti(payload: PayloadInsertCuti) {
    const pegawai = await this.repo.findPegawaiByUserId(payload.user_id);
    if (!pegawai) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND });

    this.ensureValidDateRange(payload.tanggal_dari, payload.tanggal_sampai);

    const pegawaiId = pegawai.id;

    const result = await this.repo.insertCuti(pegawaiId, payload);
    return result;
  }

  async updateCuti(payload: PayloadUpdateCuti) {
    const pegawai = await this.repo.findPegawaiByUserId(payload.user_id);
    if (!pegawai) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND });

    this.ensureValidDateRange(payload.tanggal_dari, payload.tanggal_sampai);

    const cuti = await this.repo.findCutiByPegawaiIdAndCutiId(pegawai.id, payload.cuti_id);
    if (!cuti) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_DETAIL_CUTI_NOTFOUND });
    if (cuti.status !== StatusCuti.MENUNGGU) {
      throw new RpcException({ statusCode: 400, message: CutiPegawaiConstant.ERR_CUTI_ALREADY_PROCESSED });
    }

    return this.repo.updateCuti(pegawai.id, payload);
  }

  async cancelCuti(payload: PayloadCancelCuti) {
    const pegawai = await this.repo.findPegawaiByUserId(payload.user_id);
    if (!pegawai) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_PEGAWAI_NOTFOUND });

    const cuti = await this.repo.findCutiByPegawaiIdAndCutiId(pegawai.id, payload.cuti_id);
    if (!cuti) throw new RpcException({ statusCode: 404, message: CutiPegawaiConstant.ERR_DETAIL_CUTI_NOTFOUND });
    if (cuti.status === StatusCuti.DIBATALKAN) {
      throw new RpcException({ statusCode: 400, message: CutiPegawaiConstant.ERR_CUTI_ALREADY_CANCELED });
    }
    if (cuti.status !== StatusCuti.MENUNGGU) {
      throw new RpcException({ statusCode: 400, message: CutiPegawaiConstant.ERR_CUTI_ALREADY_PROCESSED });
    }

    return this.repo.cancelCuti(payload.cuti_id);
  }

  private ensureValidDateRange(tanggalDari: string, tanggalSampai: string) {
    if (new Date(tanggalDari) > new Date(tanggalSampai)) {
      throw new RpcException({
        statusCode: 400,
        message: CutiPegawaiConstant.ERR_INVALID_DATE_RANGE,
      });
    }
  }

}
