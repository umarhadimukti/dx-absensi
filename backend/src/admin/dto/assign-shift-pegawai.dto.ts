import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class AssignShiftPegawaiDto {
  @IsInt()
  @IsPositive({ message: 'shift_id harus berupa bilangan positif' })
  @IsNotEmpty({ message: 'shift_id tidak boleh kosong' })
  shift_id: number;

  @IsDateString({}, { message: 'berlaku_dari harus berupa tanggal valid (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'berlaku_dari tidak boleh kosong' })
  berlaku_dari: string;

  @IsDateString({}, { message: 'berlaku_sampai harus berupa tanggal valid (YYYY-MM-DD)' })
  @IsOptional()
  berlaku_sampai?: string;
}
