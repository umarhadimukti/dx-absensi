import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtUtil {
  constructor(private readonly config: ConfigService) {}

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign({ ...payload }, this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), {
      expiresIn: (this.config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m') as any,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign({ ...payload }, this.config.getOrThrow<string>('JWT_REFRESH_SECRET'), {
      expiresIn: (this.config.get('JWT_REFRESH_EXPIRES_IN') ?? '7d') as any,
    });
  }
}
