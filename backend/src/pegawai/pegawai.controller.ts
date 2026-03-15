import { BadRequestException, Controller, Get, Inject, NotFoundException, Query } from '@nestjs/common';
import { CUTI_PEGAWAI_SERVICE, PegawaiConstant } from './pegawai.constant';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { GetRiwayatCutiDto } from './dto/filter-riwayat-cuti.dto';
import { GetUser } from 'src/common/interceptors/get-user.interceptor';
import { AuthUser } from 'src/auth/auth.interface';
import { PresensiPegawaiRepository } from 'src/presensi-pegawai/presensi-pegawai.repository';

@Controller()
export class PegawaiController {
  constructor(
    @Inject(CUTI_PEGAWAI_SERVICE) private readonly cutiPegawaiClient: ClientProxy,
    private readonly presensiPegawaiRepo: PresensiPegawaiRepository,
  ) {}

  @Get('riwayat-cuti')
  async getRiwayatCuti(
    @GetUser() user: AuthUser,
    @Query() filter: GetRiwayatCutiDto,
  ) {
    const pegawai = await this.presensiPegawaiRepo.findPegawaiByUserId(user.userId);
    if (!pegawai) throw new NotFoundException(PegawaiConstant.ERR_PEGAWAI_NOT_FOUND);

    const payload = {
      pegawai_id: pegawai.id,
      page: filter.page,
      limit: filter.limit,
      ...(filter.keyword && { keyword: filter.keyword })
    }

    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.riwayat' }, payload)
      .pipe(catchError(err => {
        throw new BadRequestException(err.message || 'Gagal mengambil riwayat cuti');
      }))
  }
}
