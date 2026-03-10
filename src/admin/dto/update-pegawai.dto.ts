import { 
  IsBoolean, 
  IsEmail, 
  IsEnum, 
  IsOptional, 
  IsString, 
  IsDateString,
  IsNotEmpty 
} from "class-validator";

export class UpdatePegawaiDto {
  // User Fields
  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'HR', 'KARYAWAN'], { message: 'Role harus ADMIN, HR, atau KARYAWAN' })
  role?: 'ADMIN' | 'HR' | 'KARYAWAN';

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  is_active?: boolean;

  // Pegawai Fields
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'NIP tidak boleh kosong jika dikirim' })
  nip?: string;

  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  departemen?: string;

  @IsOptional()
  @IsString()
  jabatan?: string;

  @IsOptional()
  @IsString()
  no_telepon?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal harus YYYY-MM-DD' })
  tanggal_masuk?: string;

  @IsOptional()
  @IsBoolean()
  is_aktif?: boolean;
}