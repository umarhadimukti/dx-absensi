export const PresensiPegawaiConstant = {
  ALLOWED_MIME: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5mb

  ERR_INVALID_MIMETYPE: 'Format foto tidak valid. Gunakan JPEG, PNG, atau WebP',

  ERR_PEGAWAI_NOTFOUND: 'Data pegawai tidak ditemukan untuk akun ini',
  
  ERR_SUDAH_PRESENSI_MASUK: 'Anda sudah melakukan presensi masuk hari ini',
  ERR_SUDAH_PRESENSI_KELUAR: 'Anda sudah melakukan presensi keluar hari ini',
  ERR_BELUM_PRESENSI_MASUK: 'Anda belum melakukan presensi masuk hari ini',
}

export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';
