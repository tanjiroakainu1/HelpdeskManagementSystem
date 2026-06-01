import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { ROLES, ROLE_CONFIGS } from '@/lib/roles';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';
import type { UserRole } from '@/types';

export default function Roles() {
  const refresh = useRefresh();
  const users = useAppDb().users;
  return (
    <>
      <PageHeader title="Manage Roles" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>User</th>
                  <th>Role</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td data-label="User" className="p-2">{u.fullName}</td>
                    <td data-label="Role" className="p-2">{ROLES[u.role].label}</td>
                    <td data-label="Change" className="p-2">
                      <select
                        className="form-input w-full max-w-full sm:w-auto"
                        defaultValue={u.role}
                        onChange={(e) => {
                          api.updateUserRole(u.id, e.target.value as UserRole);
                          refresh();
                        }}
                      >
                        {ROLE_CONFIGS.map((r) => (
                          <option key={r.key} value={r.key}>{r.label}</option>
                        ))}
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
