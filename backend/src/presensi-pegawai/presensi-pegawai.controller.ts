import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PresensiPegawaiService } from './presensi-pegawai.service';
import { PresensiMasukDto } from './dto/presensi-masuk.dto';
import { PresensiKeluarDto } from './dto/presensi-keluar.dto';
import { GetUser } from 'src/common/interceptors/get-user.interceptor';
import type { AuthUser } from 'src/auth/auth.interface';
import { UsePresensiUpload } from 'src/common/decorators/upload-presensi.decorator';

@Controller('presensi-pegawai')
export class PresensiPegawaiController {
  constructor(private readonly presensiService: PresensiPegawaiService) {}

  @Post('masuk')
  @HttpCode(HttpStatus.CREATED)
  @UsePresensiUpload()
  presensiMasuk(
    @Req() req: Request,
    @GetUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PresensiMasukDto,
  ) {
    if (!file) {
      throw new BadRequestException((req as any)._uploadError ?? 'Foto masuk wajib diupload');
    }
    return this.presensiService.presensiMasuk(user.userId, file, dto);
  }

  @Post('keluar')
  @HttpCode(HttpStatus.OK)
  @UsePresensiUpload()
  presensiKeluar(
    @Req() req: Request,
    @GetUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PresensiKeluarDto,
  ) {
    if (!file) {
      throw new BadRequestException((req as any)._uploadError ?? 'Foto keluar wajib diupload');
    }
    return this.presensiService.presensiKeluar(user.userId, file, dto);
  }
}
