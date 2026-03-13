export interface CheckInPayload {
  nama: string;
  nip: string;
  email: string;
  jam_masuk: string; // format "HH:MM WIB"
  tanggal: string;   // format "DD MMM YYYY"
  status: 'HADIR' | 'TERLAMBAT';
}
