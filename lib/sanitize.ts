import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function sanitizeHtmlText(input: string): string {
  if (!input) return "";

  // Remove dangerous script, iframe, object, embed, event handlers, and javascript: links
  let clean = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:[^\s"']+/gi, "#");

  return clean;
}

export function validateSafeUrl(url: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();

  // Allow anchor links, relative links, http and https
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;

  return false;
}

export function validateTrackingFormat(type: 'ga' | 'gtm' | 'pixel', id: string): boolean {
  if (!id || id.trim() === '') return true; // Optional empty
  const val = id.trim();

  if (type === 'ga') {
    return /^G-[A-Z0-9]+$/i.test(val);
  }
  if (type === 'gtm') {
    return /^GTM-[A-Z0-9]+$/i.test(val);
  }
  if (type === 'pixel') {
    return /^[0-9]+$/.test(val);
  }
  return false;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  safeName?: string;
  type?: 'image' | 'video';
}

const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
];

const ALLOWED_VIDEO_MIMES = [
  'video/mp4',
  'video/webm',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function validateMediaUpload(filename: string, mimeType: string, size: number): FileValidationResult {
  const ext = path.extname(filename).toLowerCase();

  // Disallow executables and dangerous extensions
  const FORBIDDEN_EXTS = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.ts', '.html', '.htm', '.vbs', '.ps1', '.jar'];
  if (FORBIDDEN_EXTS.includes(ext)) {
    return { valid: false, error: `Định dạng tệp ${ext} bị cấm vì lý do bảo mật.` };
  }

  const isImage = ALLOWED_IMAGE_MIMES.includes(mimeType);
  const isVideo = ALLOWED_VIDEO_MIMES.includes(mimeType);

  if (!isImage && !isVideo) {
    return { valid: false, error: 'Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WebP, AVIF, SVG, MP4, WebM.' };
  }

  if (isImage && size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Dung lượng ảnh vượt quá giới hạn tối đa 10MB.' };
  }

  if (isVideo && size > MAX_VIDEO_SIZE) {
    return { valid: false, error: 'Dung lượng video vượt quá giới hạn tối đa 50MB.' };
  }

  const cleanBaseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = `${cleanBaseName}_${Date.now()}${ext}`;

  return {
    valid: true,
    safeName,
    type: isImage ? 'image' : 'video',
  };
}

export async function saveUploadedFile(buffer: Buffer, safeName: string): Promise<string> {
  ensureUploadsDir();
  const filePath = path.join(UPLOADS_DIR, safeName);
  await fs.promises.writeFile(filePath, buffer);
  return `/uploads/${safeName}`;
}
