import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { useAppDb } from '@/hooks/useAppDb';

export default function UserActions() {
  const records = useAppDb().systemRecords.filter((r) => r.entityType === 'user' || r.userId).slice(0, 80);
  return (
    <>
      <PageHeader title="User Actions" description="User-related entries from the shared system log." />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>User</th>
                  <th>Role</th>
                  <th>Operation</th>
                  <th>Summary</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td data-label="User" className="p-2">{r.userName}</td>
                    <td data-label="Role" className="p-2 text-xs text-muted">{r.userRole ?? '—'}</td>
                    <td data-label="Operation" className="p-2">{r.operation}</td>
                    <td data-label="Summary" className="p-2">{r.summary}</td>
                    <td data-label="When" className="p-2">{r.createdAt.slice(0, 16)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTableWrap>
        </div>
      </div>
    </>
  );
}
