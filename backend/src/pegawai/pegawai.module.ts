import { Module } from '@nestjs/common';
import { PegawaiController } from './pegawai.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CUTI_PEGAWAI_SERVICE } from './pegawai.constant';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PresensiPegawaiModule } from 'src/presensi-pegawai/presensi-pegawai.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CUTI_PEGAWAI_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CUTI_PEGAWAI_SERVICE_HOST') ?? '0.0.0.0',
            port: configService.get('CUTI_PEGAWAI_SERVICE_PORT') ?? 3008,
          },
        }),
      },
    ]),
    PresensiPegawaiModule,
  ],
  controllers: [PegawaiController],
})
export class PegawaiModule {}
