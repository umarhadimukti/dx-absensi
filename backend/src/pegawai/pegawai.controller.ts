import { BadRequestException, Controller, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CUTI_PEGAWAI_SERVICE } from './pegawai.constant';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { GetRiwayatCutiDto } from './dto/filter-riwayat-cuti.dto';
import { GetUser } from 'src/common/interceptors/get-user.interceptor';
import { AuthUser } from 'src/auth/auth.interface';

@Controller()
export class PegawaiController {
  constructor(
    @Inject(CUTI_PEGAWAI_SERVICE) private readonly cutiPegawaiClient: ClientProxy,
  ) {}

  @Get('riwayat-cuti')
  getRiwayatCuti(
    @GetUser() user: AuthUser,
    @Query() filter: GetRiwayatCutiDto,
  ) {
    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.riwayat' }, { user_id: user.userId, ...filter })
      .pipe(catchError(err => {
        throw new BadRequestException(err.message || 'Gagal mengambil riwayat cuti');
      }));
  }

  @Get('riwayat-cuti/:id/detail')
  detailRiwayatCuti(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) cutiId: number,
  ) {
    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.riwayat.detail' }, { user_id: user.userId, cuti_id: cutiId })
      .pipe(catchError(err => {
        throw new BadRequestException(err.message || 'Gagal mengambil detail riwayat cuti');
      }))
  }
}
