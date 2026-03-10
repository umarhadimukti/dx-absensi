import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../common/jwt/jwt-payload.interface';
import { AuthConstant } from '../auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthConstant.STRATEGY_JWT) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
