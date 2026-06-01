import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import type { Asset } from '@/types';

export default function HardwareMaintenance() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const assets = useAppDb().assets.filter((a) => ['hardware', 'peripheral'].includes(a.type));

  const setStatus = (id: number, status: Asset['status']) => {
    api.updateAsset(id, { status }, user?.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Hardware Maintenance" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Tag</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td data-label="Tag" className="p-2">
                      {a.assetTag}
                    </td>
                    <td data-label="Name" className="p-2">
                      {a.name}
                    </td>
                    <td data-label="Status" className="p-2">
                      <select
                        className="form-input py-1"
                        value={a.status}
                        onChange={(e) => setStatus(a.id, e.target.value as Asset['status'])}
                      >
                        <option value="active">active</option>
                        <option value="repair">repair</option>
                        <option value="retired">retired</option>
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
