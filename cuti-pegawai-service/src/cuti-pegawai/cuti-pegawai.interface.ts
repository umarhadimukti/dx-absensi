export interface FilterRiwayatCuti {
  pegawai_id: number;
  page: number;
  limit: number;
  keyword?: string;
}

export interface PayloadRiwayatCuti {
  page: number;
  limit: number;
  skip: number;
  keyword?: string;
}