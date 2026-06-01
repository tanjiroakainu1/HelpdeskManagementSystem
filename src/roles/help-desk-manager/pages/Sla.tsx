import { PageHeader } from '@/components/ui/PageHeader';
import { PriorityBadge } from '@/components/ui/Badge';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function Sla() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const policies = useAppDb().slaPolicies;

  return (
    <>
      <PageHeader title="SLA Policies" description="Edit targets — changes apply across the whole system." />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Policy</th>
                  <th>Priority</th>
                  <th>Resolve (hours)</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td data-label="Policy" className="p-2">
                      {p.name}
                    </td>
                    <td data-label="Priority" className="p-2">
                      <PriorityBadge priority={p.priority} />
                    </td>
                    <td data-label="Resolve (hours)" className="p-2">
                      <input
                        type="number"
                        min={1}
                        className="form-input w-24 py-1"
                        defaultValue={p.resolveHours}
                        onBlur={(e) => {
                          const hours = Number(e.target.value);
                          if (hours > 0 && hours !== p.resolveHours) {
                            api.updateSlaPolicy(p.id, { resolveHours: hours }, user?.id);
                            refresh();
                          }
                        }}
                      />
                    </td>
                    <td data-label="Active" className="p-2">
                      <select
                        className="form-input w-full max-w-[6rem] py-1 sm:w-auto"
                        value={p.isActive ? '1' : '0'}
                        onChange={(e) => {
                          api.updateSlaPolicy(p.id, { isActive: e.target.value === '1' }, user?.id);
                          refresh();
                        }}
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
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
