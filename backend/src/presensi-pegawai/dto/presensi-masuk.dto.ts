import { IsOptional, IsString } from 'class-validator';

export class PresensiMasukDto {
  @IsString()
  @IsOptional()
  lokasi_masuk?: string;

  @IsString()
  @IsOptional()
  keterangan?: string;
}
