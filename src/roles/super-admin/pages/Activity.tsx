import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { useAppDb } from '@/hooks/useAppDb';

export default function Activity() {
  const logs = useAppDb().auditLogs.slice(0, 50);
  return (
    <>
      <PageHeader title="System Activity" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Action</th>
                  <th>Details</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td data-label="Action" className="p-2">{l.action}</td>
                    <td data-label="Details" className="p-2">{l.details}</td>
                    <td data-label="When" className="p-2">{l.createdAt.slice(0, 16)}</td>
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
