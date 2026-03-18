import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateKantorDto {
  @IsOptional()
  @IsString({ message: 'Nama kantor harus berupa string' })
  @IsNotEmpty({ message: 'Nama kantor tidak boleh kosong jika dikirim' })
  nama?: string;

  @IsOptional()
  @IsString({ message: 'Alamat harus berupa string' })
  alamat?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude harus berupa angka' })
  @IsNotEmpty({ message: 'Latitude tidak boleh kosong jika dikirim' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude harus berupa angka' })
  @IsNotEmpty({ message: 'Longitude tidak boleh kosong jika dikirim' })
  longitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Radius harus berupa angka (meter)' })
  radius?: number;
}
