import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsString({ message: 'Nama shift harus berupa string' })
  @IsNotEmpty({ message: 'Nama shift tidak boleh kosong'})
  nama_shift: string;

  @IsString({ message: 'Jam masuk harus berupa string (HH:mm)' })
  @IsNotEmpty({ message: 'Jam masuk tidak boleh kosong (HH:mm)'})
  jam_masuk: string;
  
  @IsString({ message: 'Jam keluar harus berupa string (HH:mm)' })
  @IsNotEmpty({ message: 'Jam keluar tidak boleh kosong (HH:mm)'})
  jam_keluar: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Toleransi tidak boleh kosong (harus berupa menit)'})
  toleransi: number;
}