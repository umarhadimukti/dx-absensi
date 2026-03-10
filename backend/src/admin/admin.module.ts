import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { PegawaiController } from './pegawai.controller';

@Module({
  controllers: [PegawaiController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
