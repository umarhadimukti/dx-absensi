import { Module } from '@nestjs/common';
import { CutiPegawaiService } from './cuti-pegawai.service';
import { CutiPegawaiController } from './cuti-pegawai.controller';
import { CutiPegawaiRepository } from './cuti-pegawai.repository';

@Module({
  providers: [CutiPegawaiService, CutiPegawaiRepository],
  controllers: [CutiPegawaiController]
})
export class CutiPegawaiModule {}
