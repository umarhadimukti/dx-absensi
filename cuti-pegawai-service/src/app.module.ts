import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CutiPegawaiModule } from './cuti-pegawai/cuti-pegawai.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    CutiPegawaiModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
