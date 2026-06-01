import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { useAppDb } from '@/hooks/useAppDb';

export default function Reports() {
  const db = useAppDb();
  const agents = db.users.filter((u) => ['support_agent', 'it_technician'].includes(u.role));
  const perf = agents.map((a) => ({
    name: a.fullName,
    assigned: db.tickets.filter((t) => t.assignedTo === a.id).length,
    closed: db.tickets.filter((t) => t.assignedTo === a.id && ['closed', 'resolved'].includes(t.status)).length,
  }));

  return (
    <>
      <PageHeader title="Operational Reports" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Agent</th>
                  <th>Assigned</th>
                  <th>Closed</th>
                </tr>
              </thead>
              <tbody>
                {perf.map((p) => (
                  <tr key={p.name} className="border-t border-border">
                    <td data-label="Agent" className="p-2">
                      {p.name}
                    </td>
                    <td data-label="Assigned" className="p-2">
                      {p.assigned}
                    </td>
                    <td data-label="Closed" className="p-2">
                      {p.closed}
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
