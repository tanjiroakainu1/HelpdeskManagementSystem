import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { ROLES } from '@/lib/roles';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function Users() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const users = useAppDb().users;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const saveName = (id: number) => {
    api.updateUser(id, { fullName: editName }, user?.id);
    setEditingId(null);
    refresh();
  };

  const toggleActive = (id: number, isActive: boolean) => {
    api.updateUser(id, { isActive: !isActive }, user?.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Manage Users" description="User records in localStorage — changes apply for all roles." />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td data-label="Name" className="p-2">
                      {editingId === u.id ? (
                        <div className="flex flex-wrap gap-2">
                          <input className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          <button type="button" className="btn-primary btn-sm" onClick={() => saveName(u.id)}>
                            Save
                          </button>
                          <button type="button" className="btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        u.fullName
                      )}
                    </td>
                    <td data-label="Email" className="p-2 break-all">
                      {u.email}
                    </td>
                    <td data-label="Role" className="p-2">
                      {ROLES[u.role].label}
                    </td>
                    <td data-label="Status" className="p-2">
                      {u.isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td data-label="Actions" className="p-2">
                      <div className="flex flex-wrap gap-2">
                        {editingId !== u.id && (
                          <button
                            type="button"
                            className="btn-ghost btn-sm"
                            onClick={() => {
                              setEditingId(u.id);
                              setEditName(u.fullName);
                            }}
                          >
                            Edit name
                          </button>
                        )}
                        <button
                          type="button"
                          className={u.isActive ? 'btn-danger btn-sm' : 'btn-success btn-sm'}
                          onClick={() => toggleActive(u.id, u.isActive)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
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
