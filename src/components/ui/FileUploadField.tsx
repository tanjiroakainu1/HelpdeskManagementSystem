import { useId, useRef, useState } from 'react';
import { AttachmentPreview } from '@/components/ui/AttachmentPreview';
import { fileToAttachmentPayload, formatFileSize } from '@/lib/files';
import type { AttachmentPayload } from '@/types';

type Props = {
  label?: string;
  value: AttachmentPayload | null;
  onChange: (payload: AttachmentPayload | null) => void;
  accept?: string;
  required?: boolean;
  hint?: string;
};

export function FileUploadField({
  label = 'Choose file',
  value,
  onChange,
  accept = 'image/*,.pdf,.doc,.docx,.txt,.log,.png,.jpg,.jpeg,.gif,.webp',
  required,
  hint,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const payload = await fileToAttachmentPayload(file);
      onChange(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read file');
      onChange(null);
    } finally {
      setBusy(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void pickFile(file);
  };

  const clear = () => {
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="file-upload-field">
      <label className="form-label" htmlFor={inputId}>
        {label}
        {required && <span className="text-candy-light"> *</span>}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="file-upload-field__input"
        accept={accept}
        required={required && !value}
        onChange={onInputChange}
        disabled={busy}
      />

      <label htmlFor={inputId} className={`file-upload-field__drop ${value ? 'file-upload-field__drop--has-file' : ''}`}>
        {value ? (
          <div className="file-upload-field__chosen">
            <AttachmentPreview
              fileName={value.fileName}
              mimeType={value.mimeType}
              dataUrl={value.dataUrl}
              size="lg"
            />
            <div className="file-upload-field__meta min-w-0">
              <p className="file-upload-field__name" title={value.fileName}>
                {value.fileName}
              </p>
              <p className="text-xs text-muted">
                {value.mimeType || 'Unknown type'} · {formatFileSize(value.fileSize)}
              </p>
              <p className="mt-1 text-xs text-candy-mint">Visible preview — tap to replace</p>
            </div>
          </div>
        ) : (
          <div className="file-upload-field__empty">
            <span className="file-upload-field__icon" aria-hidden>
              📎
            </span>
            <p className="font-medium text-slate-200">Tap to choose a photo or document</p>
            <p className="mt-1 text-xs text-muted">Images show a live preview · Max 2 MB</p>
          </div>
        )}
      </label>

      {value && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost btn-sm" onClick={() => inputRef.current?.click()}>
            Replace file
          </button>
          <button type="button" className="btn-ghost btn-sm" onClick={clear}>
            Clear
          </button>
        </div>
      )}

      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
      {error && <p className="alert-error mt-2">{error}</p>}
      {busy && <p className="mt-2 text-xs text-candy-mint">Reading file…</p>}
    </div>
  );
}
