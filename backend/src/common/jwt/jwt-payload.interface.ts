export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  is_active: boolean;
}
