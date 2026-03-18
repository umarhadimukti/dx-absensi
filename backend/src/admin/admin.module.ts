import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { PegawaiController } from './pegawai.controller';
import { ShiftController } from './shift/shift.controller';
import { ShiftService } from './shift/shift.service';
import { ShiftRepository } from './shift/shift.repository';
import { AdminKantorController } from './kantor/kantor.controller';
import { AdminKantorService } from './kantor/kantor.service';
import { AdminKantorRepository } from './kantor/kantor.repository';

@Module({
  controllers: [PegawaiController, ShiftController, AdminKantorController],
  providers: [AdminService, AdminRepository, ShiftService, ShiftRepository, AdminKantorService, AdminKantorRepository],
})
export class AdminModule {}
