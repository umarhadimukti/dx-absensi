import { Type } from "@nestjs/common";

export const cors = {
  ORIGINS: ['http://localhost:5173', 'http://localhost:3006'],
  METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

export const CommonConstant = {
  ERR_FORBIDDEN_ACCESS: 'Anda tidak memiliki akses ke sumber daya ini.',
  ERR_UNAUTHORIZED: 'Anda tidak terautentikasi.',
  ERR_UNACTIVE_USER: 'Akun tidak aktif, silahkan hubungi tim admin.',
}

export const GroupingAPI = (path: string, module: Type<any>) => ({ path, module });
