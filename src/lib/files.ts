import type { AttachmentPayload } from '@/types';

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;

export function isImageMime(mime?: string): boolean {
  return Boolean(mime?.startsWith('image/'));
}

export function isImageFileName(name: string): boolean {
  return IMAGE_EXT.test(name);
}

export function formatFileSize(bytes?: number): string {
  if (bytes == null || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export async function fileToAttachmentPayload(file: File): Promise<AttachmentPayload> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large (max ${formatFileSize(MAX_UPLOAD_BYTES)}).`);
  }
  const mimeType = file.type || undefined;
  const dataUrl = isImageMime(mimeType) || isImageFileName(file.name) ? await readFileAsDataUrl(file) : undefined;
  return {
    fileName: file.name,
    mimeType,
    fileSize: file.size,
    dataUrl,
  };
}

/** Small SVG used in seed data so image attachments show a preview immediately */
export const DEMO_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs><rect width="160" height="120" rx="12" fill="#0f172a"/><rect x="12" y="12" width="136" height="72" rx="8" fill="url(#g)" opacity="0.35"/><circle cx="52" cy="44" r="10" fill="#6ee7b7"/><path d="M20 88 L56 56 L88 72 L120 40 L140 88 Z" fill="#a78bfa" opacity="0.9"/></svg>',
  );
