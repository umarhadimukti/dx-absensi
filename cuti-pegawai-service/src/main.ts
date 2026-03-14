import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const configService = appContext.get(ConfigService);

  const host = configService.get<string>('CUTI_PEGAWAI_SERVICE_HOST') ?? '0.0.0.0';
  const port = configService.get<number>('CUTI_PEGAWAI_SERVICE_PORT') ?? 3008;
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { port, host },
    }
  )
  await app.listen();
  console.log(`🚀 Cuti Pegawai Service is listening on port ${port}`);
}
bootstrap();
