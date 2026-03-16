import type { JenisCuti } from 'generated/client';

export interface FilterRiwayatCuti {
  user_id: number;
  page: number;
  limit: number;
  keyword?: string;
}
export interface PayloadRiwayatCuti {
  limit: number;
  skip: number;
  keyword?: string;
}

export interface PayloadDetailRiwayatCuti {
  user_id: number;
  cuti_id: number;
}

export interface PayloadInsertCuti {
  user_id: number;
  jenis_cuti: JenisCuti;
  tanggal_dari: string;
  tanggal_sampai: string;
  alasan: string;
}

export interface PayloadUpdateCuti {
  user_id: number;
  cuti_id: number;
  jenis_cuti: JenisCuti;
  tanggal_dari: string;
  tanggal_sampai: string;
  alasan: string;
}

export interface PayloadCancelCuti {
  user_id: number;
  cuti_id: number;
}