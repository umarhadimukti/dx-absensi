export interface Pegawai {
  id: number;
  user_id: number;
  nip: string;
  nama: string;
  departemen: string | null;
  jabatan: string | null;
  no_telepon: string | null;
  alamat: string | null;
  tanggal_masuk: string | null;
  is_aktif: boolean;
  created_at: string;
  updated_at: string;
  user: {
    email: string;
    role: 'ADMIN' | 'HR' | 'KARYAWAN';
    is_active: boolean;
  };
}

export interface PegawaiListData {
  data: Pegawai[];
  pagination: {
    page: number;
    limit: number;
    total_data: number;
    total_page: number;
  };
}

export interface CreatePegawaiPayload {
  email: string;
  password: string;
  role?: 'ADMIN' | 'HR' | 'KARYAWAN';
  nip: string;
  nama: string;
  departemen?: string;
  jabatan?: string;
  no_telepon?: string;
  alamat?: string;
  tanggal_masuk?: string;
}

export interface UpdatePegawaiPayload {
  email?: string;
  role?: 'ADMIN' | 'HR' | 'KARYAWAN';
  is_active?: boolean;
  nip?: string;
  nama?: string;
  departemen?: string;
  jabatan?: string;
  no_telepon?: string;
  alamat?: string;
  tanggal_masuk?: string;
  is_aktif?: boolean;
}
