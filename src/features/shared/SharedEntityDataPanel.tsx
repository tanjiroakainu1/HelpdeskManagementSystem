import { useMemo } from 'react';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppDb } from '@/hooks/useAppDb';
import { getSharedEntityRows } from '@/lib/entityTableData';

/** Live shared entity rows — identical for every role. */
export function SharedEntityDataPanel({
  entityType,
  limit = 20,
}: {
  entityType: string;
  limit?: number;
}) {
  const db = useAppDb();
  const { columns, rows } = useMemo(
    () => getSharedEntityRows(db, entityType, limit),
    [db, entityType, limit],
  );

  const title =
    entityType === 'settings'
      ? 'System settings (shared)'
      : `Shared ${entityType} records`;

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="min-w-0">
          <h2>{title}</h2>
          <p className="mt-1 text-xs text-muted">
            All roles see the same live helpdesk records in the system.
          </p>
        </div>
      </div>
      <div className="card-body card-body--flush-table">
        {!rows.length ? (
          <div className="p-5">
            <EmptyState
              title={`No ${entityType} data yet`}
              description="Create or update records on this page — they appear here for every role."
              icon="📋"
            />
          </div>
        ) : (
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  {columns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="border-t border-border">
                    {columns.map((c) => (
                      <td key={c.key} data-label={c.label} className="p-2">
                        {row[c.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTableWrap>
        )}
      </div>
    </div>
  );
}
