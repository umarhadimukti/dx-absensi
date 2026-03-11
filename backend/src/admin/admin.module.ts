import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { PegawaiController } from './pegawai.controller';
import { ShiftController } from './shift/shift.controller';
import { ShiftService } from './shift/shift.service';
import { ShiftRepository } from './shift/shift.repository';

@Module({
  controllers: [PegawaiController, ShiftController],
  providers: [AdminService, AdminRepository, ShiftService, ShiftRepository],
})
export class AdminModule {}
