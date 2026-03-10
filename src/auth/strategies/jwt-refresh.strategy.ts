import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { JwtPayload } from '../../common/jwt/jwt-payload.interface';
import { AuthConstant } from '../auth.constant';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, AuthConstant.STRATEGY_JWT_REFRESH) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token ?? null,
      ]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
