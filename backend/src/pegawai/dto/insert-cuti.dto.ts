import { IsDateString, IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";
import { JenisCuti, StatusCuti } from "generated/prisma/enums";

export class InsertCutiDto {
  @IsEnum(JenisCuti)
  jenis_cuti: string;

  @IsDateString({}, { message: 'Format Tanggal harus (YYYY-MM-DD)' })
  tanggal_dari: string;

  @IsDateString({}, { message: 'Format Tanggal harus (YYYY-MM-DD)' })
  tanggal_sampai: string;

  @IsNotEmpty({ message: 'Alasan tidak boleh kosong' })
  alasan: string;
}