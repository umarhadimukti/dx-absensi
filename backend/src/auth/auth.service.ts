import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtUtil } from '../common/jwt/jwt.util';
import { AuthRepository } from './auth.repository';
import type { JwtPayload } from '../common/jwt/jwt-payload.interface';
import type { AuthUser } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtUtil: JwtUtil,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await compare(password, user.password);
    if (!isValid) return null;

    return { userId: user.id, email: user.email, role: user.role, isActive: user.is_active };
  }

  login(user: AuthUser) {
    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
      is_active: user.isActive,
    };
    return {
      accessToken: this.jwtUtil.generateAccessToken(payload),
      refreshToken: this.jwtUtil.generateRefreshToken(payload),
      user: { id: user.userId, email: user.email, role: user.role },
    };
  }

  refreshToken(user: AuthUser) {
    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
      is_active: user.isActive,
    };
    return {
      accessToken: this.jwtUtil.generateAccessToken(payload),
    };
  }

  getMe(userId: number) {
    return this.authRepository.findById(userId);
  }
}
