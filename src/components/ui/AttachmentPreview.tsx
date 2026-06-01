import { isImageFileName, isImageMime } from '@/lib/files';

export function AttachmentPreview({
  fileName,
  mimeType,
  dataUrl,
  size = 'md',
  className = '',
}: {
  fileName: string;
  mimeType?: string;
  dataUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const isImage = Boolean(dataUrl) || isImageMime(mimeType) || isImageFileName(fileName);
  const dim =
    size === 'sm' ? 'h-12 w-12' : size === 'lg' ? 'h-32 w-32 sm:h-40 sm:w-40' : 'h-16 w-16 sm:h-20 sm:w-20';

  if (isImage && dataUrl) {
    return (
      <img
        src={dataUrl}
        alt={fileName}
        className={`attachment-preview-img ${dim} ${className}`}
      />
    );
  }

  const ext = fileName.includes('.') ? fileName.split('.').pop()?.toUpperCase() : 'FILE';
  return (
    <div
      className={`attachment-preview-file ${dim} ${className}`}
      title={fileName}
      aria-hidden={!fileName}
    >
      <span className="attachment-preview-file__ext">{ext?.slice(0, 4) ?? 'FILE'}</span>
    </div>
  );
}
