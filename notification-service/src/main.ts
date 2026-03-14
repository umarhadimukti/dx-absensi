import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { NotificationModule } from './notification.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(NotificationModule);

  const configService = appContext.get(ConfigService);

  const host = configService.get<string>('HOST') ?? '0.0.0.0';
  const port = configService.get<number>('PORT') ?? 3007;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );
  await app.listen();
  console.log(`🚀 Notification Service is listening on TCP port ${port}`);
}

bootstrap();
