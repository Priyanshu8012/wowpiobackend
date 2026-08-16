import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const IMAGE_EXTS = /jpg|jpeg|png|webp|svg|gif/;
const VIDEO_EXTS = /mp4|webm|mov|m4v/;
const IMAGE_MIME = /image\/(jpeg|jpg|png|webp|svg\+xml|gif)/;
const VIDEO_MIME = /video\/(mp4|webm|quicktime|x-m4v)/;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `media-${Date.now()}${ext}`);
  },
});

function checkFileType(file, cb) {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isImage = IMAGE_EXTS.test(ext) && IMAGE_MIME.test(file.mimetype);
  const isVideo =
    VIDEO_EXTS.test(ext) &&
    (VIDEO_MIME.test(file.mimetype) || file.mimetype === 'video/mp4');

  // Some browsers send application/octet-stream for mov/mp4
  const looseVideo =
    VIDEO_EXTS.test(ext) &&
    (file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream');

  if (isImage || isVideo || looseVideo) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, png, webp, gif) or videos (mp4, webm, mov) are allowed'));
}

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for short brand videos
  },
  fileFilter(req, file, cb) {
    checkFileType(file, (err, ok) => {
      if (err) cb(err);
      else cb(null, ok);
    });
  },
});

export function detectMediaType(filenameOrUrl = '') {
  const ext = path.extname(String(filenameOrUrl).split('?')[0]).toLowerCase().replace('.', '');
  if (VIDEO_EXTS.test(ext)) return 'video';
  return 'image';
}

export default upload;
