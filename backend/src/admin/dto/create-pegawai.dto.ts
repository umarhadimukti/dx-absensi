import { 
  IsEmail, 
  IsString, 
  IsEnum, 
  IsOptional, 
  MinLength, 
  IsNotEmpty, 
  IsDateString 
} from 'class-validator';

export class CreatePegawaiDto {
  // User fields
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'HR', 'KARYAWAN'], { message: 'Role harus ADMIN, HR, atau KARYAWAN' })
  role?: 'ADMIN' | 'HR' | 'KARYAWAN';

  // Pegawai fields
  @IsString()
  @IsNotEmpty({ message: 'NIP wajib diisi' })
  nip: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama wajib diisi' })
  nama: string;

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
}