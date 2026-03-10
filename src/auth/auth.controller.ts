import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';
import type { AuthUser } from './auth.interface';

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() _body: LoginDto,
  ) {
    const result = this.authService.login(req.user as AuthUser);
    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TTL_MS,
    });
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.user as AuthUser);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_COOKIE);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return this.authService.getMe((req.user as AuthUser).userId);
  }
}
