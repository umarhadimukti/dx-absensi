import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PresensiPegawaiController } from './presensi-pegawai.controller';
import { PresensiPegawaiService } from './presensi-pegawai.service';
import { PresensiPegawaiRepository } from './presensi-pegawai.repository';
import { NOTIFICATION_SERVICE } from './presensi-pegawai.constant';

@Module({
  imports: [
    /**
     * Mendaftarkan klien TCP yang terhubung ke notification-service.
     * Host dan port dibaca dari env (NOTIFICATION_SERVICE_HOST / PORT),
     * dengan fallback ke localhost:3007 untuk dev lokal.
     */
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.NOTIFICATION_SERVICE_HOST ?? 'localhost',
            port: Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3007),
          },
        }),
      },
    ]),
  ],
  controllers: [PresensiPegawaiController],
  providers: [PresensiPegawaiService, PresensiPegawaiRepository],
})
export class PresensiPegawaiModule {}
