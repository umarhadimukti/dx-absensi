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

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'api/v1/admin',
        module: AdminModule,
      },
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
    DatabaseModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
