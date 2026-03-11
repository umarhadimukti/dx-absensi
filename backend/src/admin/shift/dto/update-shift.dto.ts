import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateShiftDto {
  @IsOptional()
  @IsString({ message: 'Nama shift harus berupa string' })
  @IsNotEmpty({ message: 'Nama shift tidak boleh kosong jika dikirim'})
  nama_shift?: string;

  @IsOptional()
  @IsString({ message: 'Jam masuk harus berupa string (HH:mm)' })
  @IsNotEmpty({ message: 'Jam masuk tidak boleh kosong jika dikirim (HH:mm)'})
  jam_masuk?: string;
  
  @IsOptional()
  @IsString({ message: 'Jam keluar harus berupa string (HH:mm)' })
  @IsNotEmpty({ message: 'Jam keluar tidak boleh kosong jika dikirim (HH:mm)'})
  jam_keluar?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'Toleransi tidak boleh kosong (harus berupa menit) jika dikirim'})
  toleransi?: number;
}