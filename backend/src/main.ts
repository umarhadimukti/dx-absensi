import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { cors } from './constants/api';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: cors.ORIGINS,
    methods: cors.METHODS,
    credentials: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.getOrThrow<number>('APP_PORT') ?? 3005);
}
bootstrap();
