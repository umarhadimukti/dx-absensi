export interface Shift {
  id: number;
  nama_shift: string;
  jam_masuk: string;
  jam_keluar: string;
  toleransi: number;
  is_aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShiftListData {
  data: Shift[];
  pagination: {
    page: number;
    limit: number;
    total_data: number;
    total_page: number;
  };
}

export interface CreateShiftPayload {
  nama_shift: string;
  jam_masuk: string;
  jam_keluar: string;
  toleransi: number;
}

export interface UpdateShiftPayload {
  nama_shift?: string;
  jam_masuk?: string;
  jam_keluar?: string;
  toleransi?: number;
}

export interface ShiftPegawai {
  id: number;
  pegawai_id: number;
  shift_id: number;
  berlaku_dari: string;
  berlaku_sampai: string | null;
  created_at: string;
  updated_at: string;
  shift: Shift;
}

export interface AssignShiftPayload {
  shift_id: number;
  berlaku_dari: string;
  berlaku_sampai?: string;
}
