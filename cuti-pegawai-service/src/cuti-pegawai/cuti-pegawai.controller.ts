import { Controller } from '@nestjs/common';
import { CutiPegawaiService } from './cuti-pegawai.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { FilterRiwayatCuti, PayloadDetailRiwayatCuti } from './cuti-pegawai.interface';

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
}
