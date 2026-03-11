import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PresensiPegawaiRepository } from './presensi-pegawai.repository';
import type { PresensiMasukDto } from './dto/presensi-masuk.dto';
import type { PresensiKeluarDto } from './dto/presensi-keluar.dto';
import { PresensiPegawaiConstant } from './presensi-pegawai.constant';

@Injectable()
export class PresensiPegawaiService {
  constructor(private readonly repo: PresensiPegawaiRepository) {}

  async presensiMasuk(userId: number, file: Express.Multer.File, dto: PresensiMasukDto) {
    const pegawai = await this.repo.findPegawaiByUserId(userId);
    if (!pegawai) throw new NotFoundException(PresensiPegawaiConstant.ERR_PEGAWAI_NOTFOUND);

    const today = this.getToday();

    const existing = await this.repo.findPresensiByPegawaiAndDate(pegawai.id, today);
    if (existing) throw new ConflictException(PresensiPegawaiConstant.ERR_SUDAH_PRESENSI_MASUK);

    const now = new Date();
    const status = await this.determineStatus(pegawai.id, today, now);

    return this.repo.createPresensiMasuk({
      pegawai_id: pegawai.id,
      tanggal: today,
      jam_masuk: now,
      status,
      foto_masuk: file.path,
      lokasi_masuk: dto.lokasi_masuk,
      keterangan: dto.keterangan,
    });
  }

  async presensiKeluar(userId: number, file: Express.Multer.File, dto: PresensiKeluarDto) {
    const pegawai = await this.repo.findPegawaiByUserId(userId);
    if (!pegawai) throw new NotFoundException(PresensiPegawaiConstant.ERR_PEGAWAI_NOTFOUND);

    const today = this.getToday();

    const presensi = await this.repo.findPresensiByPegawaiAndDate(pegawai.id, today);
    if (!presensi) throw new BadRequestException(PresensiPegawaiConstant.ERR_BELUM_PRESENSI_MASUK);
    if (presensi.jam_keluar) throw new ConflictException(PresensiPegawaiConstant.ERR_SUDAH_PRESENSI_KELUAR);

    return this.repo.updatePresensiKeluar(presensi.id, {
      jam_keluar: new Date(),
      foto_keluar: file.path,
      lokasi_keluar: dto.lokasi_keluar,
    });
  }

  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private async determineStatus(pegawaiId: number, tanggal: Date, waktuMasuk: Date): Promise<'HADIR' | 'TERLAMBAT'> {
    const shiftPegawai = await this.repo.findActiveShiftForDate(pegawaiId, tanggal);
    if (!shiftPegawai) return 'HADIR';

    const [jam, menit] = shiftPegawai.shift.jam_masuk.split(':').map(Number);
    const batasWaktu = new Date(tanggal);
    batasWaktu.setHours(jam, menit + shiftPegawai.shift.toleransi, 0, 0);

    return waktuMasuk > batasWaktu ? 'TERLAMBAT' : 'HADIR';
  }
}
