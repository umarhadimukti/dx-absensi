export interface ShiftData {
  id: number;
  nama_shift: string;
  jam_masuk: string;
  jam_keluar: string;
  toleransi: number;
}

export interface PresensiData {
  id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar: string | null;
  status: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPHA' | 'CUTI';
  lokasi_masuk: string | null;
  lokasi_keluar: string | null;
  foto_masuk: string;
  foto_keluar: string | null;
  keterangan: string | null;
  pegawai: { id: number; nip: string; nama: string };
}

export interface TodayStatusData {
  presensi: PresensiData | null;
  shift: ShiftData | null;
}

export type PresensiStatus = 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPHA' | 'CUTI';

export interface RiwayatPresensiItem {
  id: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_keluar: string | null;
  status: PresensiStatus;
  lokasi_masuk: string | null;
  lokasi_keluar: string | null;
  foto_masuk: string | null;
  foto_keluar: string | null;
  keterangan: string | null;
  pegawai: {
    id: number;
    nip: string;
    nama: string;
    departemen: string | null;
    user: { email: string };
  };
  created_at: string;
  updated_at: string;
}

export interface RiwayatPresensiData {
  data: RiwayatPresensiItem[];
  pagination: {
    page: number;
    limit: number;
    total_data: number;
    total_page: number;
  };
}
