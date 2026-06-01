import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function Repairs() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const db = useAppDb();
  const repairs = db.repairLogs;
  const assets = db.assets;
  const [issue, setIssue] = useState('');
  const [assetId, setAssetId] = useState(assets[0]?.id ?? 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    api.addRepairLog({
      assetId: assetId || null,
      ticketId: null,
      technicianId: user.id,
      issueDescription: issue,
      resolution: null,
      status: 'open',
    });
    setIssue('');
    refresh();
  };

  return (
    <>
      <PageHeader title="Repair Logs" />
      <form className="card mb-4" onSubmit={submit}>
        <div className="card-body space-y-3">
          <select className="form-input" value={assetId} onChange={(e) => setAssetId(Number(e.target.value))}>
            <option value={0}>No asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.assetTag} — {a.name}
              </option>
            ))}
          </select>
          <input
            className="form-input"
            placeholder="Issue description"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Log repair
          </button>
        </div>
      </form>
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td data-label="Issue" className="p-2">
                      {r.issueDescription.slice(0, 40)}
                    </td>
                    <td data-label="Status" className="p-2">
                      {r.status}
                    </td>
                    <td data-label="Action" className="p-2">
                      {r.status !== 'completed' && (
                        <button
                          type="button"
                          className="btn-success btn-sm w-full sm:w-auto"
                          onClick={() => {
                            api.completeRepair(r.id, 'Completed', user?.id);
                            refresh();
                          }}
                        >
                          Complete
                        </button>
                      )}
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
