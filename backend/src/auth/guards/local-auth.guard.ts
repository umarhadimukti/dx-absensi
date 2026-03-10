import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthConstant } from '../auth.constant';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthConstant.STRATEGY_LOCAL) {
  handleRequest<T>(err: Error, user: T): T {
    if (err || !user) {
      throw err ?? new UnauthorizedException(AuthConstant.ERR_INVALID_CREDENTIALS);
    }
    return user;
  }
}
