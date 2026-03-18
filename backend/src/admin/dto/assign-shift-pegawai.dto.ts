import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class AssignShiftPegawaiDto {
  @IsInt()
  @IsPositive({ message: 'id shift harus berupa bilangan positif' })
  @IsNotEmpty({ message: 'id shift tidak boleh kosong' })
  shift_id: number;

  @IsDateString({}, { message: 'berlaku dari harus berupa tanggal valid (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'berlaku dari tidak boleh kosong' })
  berlaku_dari: string;

  @IsDateString({}, { message: 'berlaku sampai harus berupa tanggal valid (YYYY-MM-DD)' })
  @IsOptional()
  berlaku_sampai?: string;
}
