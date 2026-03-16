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