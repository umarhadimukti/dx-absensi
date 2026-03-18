import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKantorDto {
  @IsString({ message: 'Nama kantor harus berupa string' })
  @IsNotEmpty({ message: 'Nama kantor tidak boleh kosong' })
  nama: string;

  @IsOptional()
  @IsString({ message: 'Alamat harus berupa string' })
  alamat?: string;

  @IsNumber({}, { message: 'Latitude harus berupa angka' })
  @IsNotEmpty({ message: 'Latitude tidak boleh kosong' })
  latitude: number;

  @IsNumber({}, { message: 'Longitude harus berupa angka' })
  @IsNotEmpty({ message: 'Longitude tidak boleh kosong' })
  longitude: number;

  @IsOptional()
  @IsNumber({}, { message: 'Radius harus berupa angka (meter)' })
  radius?: number;
}
