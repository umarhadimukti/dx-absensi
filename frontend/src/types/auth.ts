export interface MeData {
  id: number;
  email: string;
  role: string;
  pegawai: {
    nip: string;
    nama: string;
    departemen: string;
    jabatan: string
  } | null;
}

export interface LoginData {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: string
  };
}