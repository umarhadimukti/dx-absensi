import { IsOptional, IsString } from 'class-validator';

export class PresensiKeluarDto {
  @IsString()
  @IsOptional()
  lokasi_keluar?: string;
}
