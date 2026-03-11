import { Module } from '@nestjs/common';
import { PresensiPegawaiController } from './presensi-pegawai.controller';
import { PresensiPegawaiService } from './presensi-pegawai.service';
import { PresensiPegawaiRepository } from './presensi-pegawai.repository';

@Module({
  controllers: [PresensiPegawaiController],
  providers: [PresensiPegawaiService, PresensiPegawaiRepository],
})
export class PresensiPegawaiModule {}
