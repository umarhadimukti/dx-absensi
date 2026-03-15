import { Controller } from '@nestjs/common';
import { CutiPegawaiService } from './cuti-pegawai.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { FilterRiwayatCuti } from './cuti-pegawai.interface';

@Controller('cuti-pegawai')
export class CutiPegawaiController {
  constructor(private readonly service: CutiPegawaiService) {}

  @MessagePattern({ cmd: 'cuti.riwayat' })
  getRiwayatCuti(@Payload() filter: FilterRiwayatCuti) {
    return this.service.getRiwayatCuti(filter);
  }

}
