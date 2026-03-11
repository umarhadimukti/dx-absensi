import { diskStorage } from "multer";
import { extname } from "path";
import { mkdirSync } from "fs";
import { PresensiPegawaiConstant } from "src/presensi-pegawai/presensi-pegawai.constant";

const UPLOAD_DIR = './uploads/presensi';
mkdirSync(UPLOAD_DIR, { recursive: true });

const PRESENSI_STORAGE = diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const multerConfig = {
  storage: PRESENSI_STORAGE,
  limits: { fileSize: PresensiPegawaiConstant.MAX_SIZE_BYTES },
  fileFilter: (req: any, file: Express.Multer.File, cb: (error: null, acceptFile: boolean) => void) => {
    if (!PresensiPegawaiConstant.ALLOWED_MIME.includes(file.mimetype)) {
      req._uploadError = PresensiPegawaiConstant.ERR_INVALID_MIMETYPE;
      return cb(null, false);
    }
    cb(null, true);
  },
};
