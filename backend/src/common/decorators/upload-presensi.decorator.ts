import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "../config/multer";

export function UsePresensiUpload() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('foto', multerConfig))
  )
}