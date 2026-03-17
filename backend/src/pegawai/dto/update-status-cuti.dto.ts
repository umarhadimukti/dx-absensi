import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StatusCuti } from "generated/prisma/enums";

export class UpdateStatusCutiDto {
  @IsNotEmpty({ message: 'Status tidak boleh kosong' })
  @IsEnum(StatusCuti, { message: 'Status harus MENUNGGU/DISETUJUI/DITOLAK/DIBATALKAN' })
  status: string;

  @IsOptional()
  @IsString({ message: 'Catatan HR harus berupa string' })
  catatan_hr?: string;
}