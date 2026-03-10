export const AuthConstant = {
  STRATEGY_LOCAL: 'local',
  STRATEGY_JWT: 'jwt',
  STRATEGY_JWT_REFRESH: 'jwt-refresh',

  ERR_INVALID_CREDENTIALS: 'Email atau password tidak cocok',
  ERR_UNAUTHORIZED: 'Akses tidak diizinkan',
  ERR_TOKEN_EXPIRED: 'Access token sudah expired',
  ERR_TOKEN_INVALID: 'Access token tidak valid',
  ERR_REFRESH_TOKEN_EXPIRED: 'Refresh token sudah expired, silakan login kembali',
  ERR_REFRESH_TOKEN_INVALID: 'Refresh token tidak valid',
} as const;
