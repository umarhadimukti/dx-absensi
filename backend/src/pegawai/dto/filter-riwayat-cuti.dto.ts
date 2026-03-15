import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetRiwayatCutiDto {
  @IsNumber({}, { message: 'Page harus berupa angka' })
  @Min(1)
  page: number = 1;

  @IsNumber({}, { message: 'Limit harus berupa angka' })
  @Min(1)
  limit: number = 10;
  
  @IsOptional()
  @IsString({ message: 'Keyword harus berupa string' })
  keyword?: string;
}