import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AdminModule,
    RouterModule.register([
      {
        path: '/admin',
        module: AdminModule,
      }
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
