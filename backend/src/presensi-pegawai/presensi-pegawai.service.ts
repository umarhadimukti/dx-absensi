import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PresensiPegawaiRepository } from './presensi-pegawai.repository';
import type { PresensiMasukDto } from './dto/presensi-masuk.dto';
import type { PresensiKeluarDto } from './dto/presensi-keluar.dto';
import { PresensiPegawaiConstant } from './presensi-pegawai.constant';
import { WIB_OFFSET_MS, wibToday } from 'src/common/utils/datetime';
import { StatusPresensi } from 'generated/prisma/enums';

@Injectable()
export class PresensiPegawaiService {
  constructor(private readonly repo: PresensiPegawaiRepository) {}

  async getTodayStatus(userId: number) {
    const pegawai = await this.repo.findPegawaiByUserId(userId);
    if (!pegawai) throw new NotFoundException(PresensiPegawaiConstant.ERR_PEGAWAI_NOTFOUND);

    const today = wibToday();
    const [presensi, shiftPegawai] = await Promise.all([
      this.repo.findPresensiByPegawaiAndDate(pegawai.id, today),
      this.repo.findActiveShiftForDate(pegawai.id, today),
    ]);

    return { presensi: presensi ?? null, shift: shiftPegawai?.shift ?? null };
  }

  async presensiMasuk(userId: number, file: Express.Multer.File, dto: PresensiMasukDto) {
    const pegawai = await this.repo.findPegawaiByUserId(userId);
    if (!pegawai) throw new NotFoundException(PresensiPegawaiConstant.ERR_PEGAWAI_NOTFOUND);

    const today = wibToday();

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

    const today = wibToday();

    const presensi = await this.repo.findPresensiByPegawaiAndDate(pegawai.id, today);
    if (!presensi) throw new BadRequestException(PresensiPegawaiConstant.ERR_BELUM_PRESENSI_MASUK);
    if (presensi.jam_keluar) throw new ConflictException(PresensiPegawaiConstant.ERR_SUDAH_PRESENSI_KELUAR);

    return this.repo.updatePresensiKeluar(presensi.id, {
      jam_keluar: new Date(),
      foto_keluar: file.path,
      lokasi_keluar: dto.lokasi_keluar,
    });
  }

  private async determineStatus(pegawaiId: number, tanggal: Date, waktuMasuk: Date): Promise<'HADIR' | 'TERLAMBAT'> {
    const shiftPegawai = await this.repo.findActiveShiftForDate(pegawaiId, tanggal);
    if (!shiftPegawai) return StatusPresensi.HADIR;

    const [jam, menit] = shiftPegawai.shift.jam_masuk.split(':').map(Number);

    const batasMs = tanggal.getTime() + (jam * 60 + menit + shiftPegawai.shift.toleransi) * 60000;

    const waktuMasukWibMs = waktuMasuk.getTime() + WIB_OFFSET_MS;

    return waktuMasukWibMs > batasMs ? StatusPresensi.TERLAMBAT : StatusPresensi.HADIR;
  }
}
