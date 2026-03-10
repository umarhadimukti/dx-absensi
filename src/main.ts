import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { cors } from './constants/api';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  app.useGlobalInterceptors(new TransformInterceptor())

  app.enableVersioning({ type: VersioningType.URI });

  app.enableCors({
    origin: cors.ORIGINS,
    methods: cors.METHODS,
  });

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.getOrThrow<number>('APP_PORT') ?? 3005);
}
bootstrap();
