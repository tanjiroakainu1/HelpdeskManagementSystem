import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { useAppDb } from '@/hooks/useAppDb';

export default function ActivityLogs() {
  const records = useAppDb().systemRecords.slice(0, 80);
  return (
    <>
      <PageHeader title="Activity Logs" description="Unified CRUD log across all roles." />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>When</th>
                  <th>User</th>
                  <th>Operation</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td data-label="When" className="p-2">{r.createdAt.slice(0, 16)}</td>
                    <td data-label="User" className="p-2">{r.userName}</td>
                    <td data-label="Operation" className="p-2">{r.operation}</td>
                    <td data-label="Summary" className="p-2">{r.summary}</td>
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
