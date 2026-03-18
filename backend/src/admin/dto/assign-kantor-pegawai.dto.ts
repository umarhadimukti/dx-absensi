import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AssignKantorPegawaiDto {
  @IsInt()
  @IsPositive({ message: 'id kantor harus berupa bilangan positif' })
  @IsNotEmpty({ message: 'id kantor tidak boleh kosong' })
  kantor_id: number;
}
