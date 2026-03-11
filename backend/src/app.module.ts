import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PresensiPegawaiModule } from './presensi-pegawai/presensi-pegawai.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GroupingAPI } from './constants/api';

@Module({
  imports: [
    RouterModule.register([
      GroupingAPI('api/v1/admin', AdminModule),
      GroupingAPI('api/v1/pegawai', PresensiPegawaiModule),
    ]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.getOrThrow('APP_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProd
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true } },
            level: isProd ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    PresensiPegawaiModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
