import { Link } from 'react-router-dom';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { OpBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { roleLabel } from '@/lib/migrateDb';
import type { SystemRecord } from '@/types';

export function SystemRecordsTable({
  records,
  compact = false,
  showViewAll,
  viewAllHref,
}: {
  records: SystemRecord[];
  compact?: boolean;
  showViewAll?: boolean;
  viewAllHref?: string;
}) {
  if (!records.length) {
    return (
      <EmptyState
        title="No activity yet"
        description="Create or update data anywhere in the system to see records here."
        icon="🗂"
      />
    );
  }

  return (
    <div>
      <DataTableWrap>
        <table className="data-table data-table--stack">
          <thead>
            <tr>
              <th>When</th>
              <th>Operation</th>
              <th>Type</th>
              {!compact && <th>User</th>}
              {!compact && <th>Role</th>}
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td data-label="When" className="whitespace-nowrap font-mono text-xs text-muted">
                  {r.createdAt.slice(0, 16)}
                </td>
                <td data-label="Operation">
                  <OpBadge operation={r.operation} />
                </td>
                <td data-label="Type">
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-slate-300">
                    {r.entityType}
                  </span>
                </td>
                {!compact && (
                  <td data-label="User" className="font-medium text-slate-200">
                    {r.userName}
                  </td>
                )}
                {!compact && (
                  <td data-label="Role" className="text-xs text-muted">
                    {roleLabel(r.userRole)}
                  </td>
                )}
                <td data-label="Summary" className="text-slate-300 sm:max-w-xs sm:truncate" title={r.summary}>
                  {r.summary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableWrap>
      {showViewAll && viewAllHref && (
        <p className="mt-4 text-center">
          <Link to={viewAllHref} className="link-accent text-sm">
            View all system records →
          </Link>
        </p>
      )}
    </div>
  );
}

export function systemRecordsPath(roleFolder: string) {
  return `/${roleFolder}/system-records`;
}
