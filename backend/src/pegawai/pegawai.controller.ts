import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { CUTI_PEGAWAI_SERVICE } from './pegawai.constant';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { GetRiwayatCutiDto } from './dto/filter-riwayat-cuti.dto';
import { GetUser } from 'src/common/interceptors/get-user.interceptor';
import { AuthUser } from 'src/auth/auth.interface';
import { InsertCutiDto } from './dto/insert-cuti.dto';
import { UpdateCutiDto } from './dto/update-cuti.dto';
import { UpdateStatusCutiDto } from './dto/update-status-cuti.dto';

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
        throw new HttpException(
          err?.message || 'Gagal mengambil riwayat cuti',
          err?.statusCode ?? HttpStatus.BAD_REQUEST,
        );
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
        throw new HttpException(
          err?.message || 'Gagal mengambil detail riwayat cuti',
          err?.statusCode ?? HttpStatus.BAD_REQUEST,
        );
      }));
  }

  @Post('cuti/insert')
  @HttpCode(HttpStatus.CREATED)
  insertCuti(
    @GetUser() user: AuthUser,
    @Body() dto: InsertCutiDto,
  ) {
    const payload = {
      user_id: user.userId,
      ...dto,
    };
    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.insert' }, payload)
      .pipe(catchError(err => {
        throw new HttpException(
          err?.message || 'Gagal mengajukan cuti baru',
          err?.statusCode || HttpStatus.BAD_REQUEST,
        );
      }));
  }

  @Put('cuti/:id/update')
  @HttpCode(HttpStatus.OK)
  updateCuti(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) cutiId: number,
    @Body() dto: UpdateCutiDto,
  ) {
    const payload = {
      user_id: user.userId,
      cuti_id: cutiId,
      ...dto,
    };

    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.update' }, payload)
      .pipe(catchError(err => {
        throw new HttpException(
          err?.message || 'Gagal mengubah pengajuan cuti',
          err?.statusCode || HttpStatus.BAD_REQUEST,
        );
      }));
  }

  @Patch('cuti/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelCuti(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) cutiId: number,
  ) {
    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.cancel' }, { user_id: user.userId, cuti_id: cutiId })
      .pipe(catchError(err => {
        throw new HttpException(
          err?.message || 'Gagal membatalkan cuti',
          err?.statusCode || HttpStatus.BAD_REQUEST,
        );
      }));
  }

  @Patch('cuti/:id/update-status')
  @HttpCode(HttpStatus.OK)
  updateStatusCuti(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) cutiId: number,
    @Body() dto: UpdateStatusCutiDto,
  ) {
    const payload = {
      user_id: user.userId,
      cuti_id: cutiId,
      status: dto.status,
      catatan_hr: dto.catatan_hr,
    };
    return this.cutiPegawaiClient
      .send({ cmd: 'cuti.update.status' }, payload)
      .pipe(catchError(err => {
        throw new HttpException(
          err?.message || 'Gagal memperbarui status cuti',
          err?.statusCode || HttpStatus.BAD_REQUEST,
        );
      }));
  }
}
