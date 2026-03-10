import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthConstant } from '../auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthConstant.STRATEGY_JWT) {
  handleRequest<T>(err: Error, user: T, info: Error): T {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(AuthConstant.ERR_TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(AuthConstant.ERR_TOKEN_INVALID);
    }
    return user;
  }
}
