import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

const REGEX_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // YYYY-MM-DD

export class GetRiwayatPresensiDto {
  @IsOptional()
  @IsString()
  @Matches(REGEX_DATE, { message: 'Format tanggal harus YYYY-MM-DD' })
  tanggal_mulai?: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_DATE, { message: 'Format tanggal harus YYYY-MM-DD' })
  tanggal_selesai?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}