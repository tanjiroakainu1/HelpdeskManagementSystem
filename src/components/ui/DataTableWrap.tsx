import type { ReactNode } from 'react';

/** Wraps tables for horizontal scroll on tablet and stacked cards on phone. */
export function DataTableWrap({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`data-table-wrap ${className}`.trim()}>{children}</div>;
}
