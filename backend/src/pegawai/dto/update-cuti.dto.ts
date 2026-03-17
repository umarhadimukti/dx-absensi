import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { JenisCuti } from 'generated/prisma/enums';

export class UpdateCutiDto {
  @IsEnum(JenisCuti, { message: 'Jenis Cuti harus TAHUNAN/SAKIT/MELAHIRKAN/DUKA/PENTING/LAINNYA' })
  jenis_cuti: string;

  @IsDateString({}, { message: 'Format Tanggal harus (YYYY-MM-DD)' })
  tanggal_dari: string;

  @IsDateString({}, { message: 'Format Tanggal harus (YYYY-MM-DD)' })
  tanggal_sampai: string;

  @IsNotEmpty({ message: 'Alasan tidak boleh kosong' })
  alasan: string;
}
