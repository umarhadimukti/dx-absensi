import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/admin',
        module: AdminModule,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
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
      rootPath: join(__dirname, '../', 'public'),
    }),
    DatabaseModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
