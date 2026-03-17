import { Controller } from '@nestjs/common';
import { CutiPegawaiService } from './cuti-pegawai.service';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import type {
  FilterRiwayatCuti,
  PayloadCancelCuti,
  PayloadDetailRiwayatCuti,
  PayloadInsertCuti,
  PayloadUpdateCuti,
  PayloadUpdateStatusCuti,
} from './cuti-pegawai.interface';

@Controller('cuti-pegawai')
export class CutiPegawaiController {
  constructor(private readonly service: CutiPegawaiService) {}

  @MessagePattern({ cmd: 'cuti.riwayat' })
  getRiwayatCuti(@Payload() filter: FilterRiwayatCuti) {
    return this.service.getRiwayatCuti(filter);
  }

  @MessagePattern({ cmd: 'cuti.riwayat.detail' })
  detailRiwayatCuti(@Payload() payload: PayloadDetailRiwayatCuti) {
    return this.service.detailRiwayatCuti(payload);
  }

  @MessagePattern({ cmd: 'cuti.insert' })
  insertCuti(@Payload() payload: PayloadInsertCuti) {
    return this.service.insertCuti(payload);
  }

  @MessagePattern({ cmd: 'cuti.update' })
  updateCuti(@Payload() payload: PayloadUpdateCuti) {
    return this.service.updateCuti(payload);
  }

  @MessagePattern({ cmd: 'cuti.cancel' })
  cancelCuti(@Payload() payload: PayloadCancelCuti) {
    return this.service.cancelCuti(payload);
  }

  @MessagePattern({ cmd: 'cuti.update.status' })
  updateStatusCuti(@Payload() payload: PayloadUpdateStatusCuti) {
    return this.service.updateStatusCuti(payload);
  }
}
