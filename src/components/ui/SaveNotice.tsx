import type { ReactNode } from 'react';
import { MSG } from '@/lib/userMessages';

/** Short success popup after CRUD — never exposes implementation details. */
export function SaveNotice({
  show,
  children,
  className = '',
}: {
  show: boolean;
  children?: ReactNode;
  className?: string;
}) {
  if (!show) return null;
  return (
    <p className={`alert-success ${className}`.trim()} role="status" aria-live="polite">
      {children ?? MSG.saveSuccess}
    </p>
  );
}
