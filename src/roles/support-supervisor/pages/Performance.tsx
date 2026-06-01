import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { useAppDb } from '@/hooks/useAppDb';

export default function Performance() {
  const db = useAppDb();
  const agents = db.users.filter((u) => u.role === 'support_agent');

  return (
    <>
      <PageHeader title="Agent Performance" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Agent</th>
                  <th>Open tickets</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td data-label="Agent" className="p-2">
                      {a.fullName}
                    </td>
                    <td data-label="Open tickets" className="p-2">
                      {
                        db.tickets.filter(
                          (t) => t.assignedTo === a.id && !['closed', 'resolved'].includes(t.status),
                        ).length
                      }
                    </td>
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
