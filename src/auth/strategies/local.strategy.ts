import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthConstant } from '../auth.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, AuthConstant.STRATEGY_LOCAL) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException(AuthConstant.ERR_INVALID_CREDENTIALS);
    return user;
  }
}
