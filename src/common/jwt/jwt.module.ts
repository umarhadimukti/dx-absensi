import { Module } from '@nestjs/common';
import { JwtUtil } from './jwt.util';

@Module({
  providers: [JwtUtil],
  exports: [JwtUtil],
})
export class JwtModule {}
