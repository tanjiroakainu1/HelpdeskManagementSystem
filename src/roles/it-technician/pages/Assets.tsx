import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import type { Asset } from '@/types';

export default function Assets() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const assets = useAppDb().assets;
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addAsset(
      { assetTag: tag, name, type: 'hardware', status: 'active', departmentId: 1, assignedUserId: null, notes: '' },
      user?.id,
    );
    setTag('');
    setName('');
    refresh();
  };

  const updateStatus = (id: number, status: Asset['status']) => {
    api.updateAsset(id, { status }, user?.id);
    refresh();
  };

  const remove = (id: number) => {
    if (!window.confirm('Delete this asset?')) return;
    api.deleteAsset(id, user?.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Assets" />
      <form className="card mb-4" onSubmit={submit}>
        <div className="card-body flex flex-col gap-3 sm:flex-row sm:items-end">
          <input className="form-input flex-1" placeholder="Tag" value={tag} onChange={(e) => setTag(e.target.value)} required />
          <input className="form-input flex-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Add
          </button>
        </div>
      </form>
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Tag</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                        onChange={(e) => updateStatus(a.id, e.target.value as Asset['status'])}
                      >
                        <option value="active">active</option>
                        <option value="repair">repair</option>
                        <option value="retired">retired</option>
                      </select>
                    </td>
                    <td data-label="Actions" className="p-2">
                      <button type="button" className="btn-danger btn-sm" onClick={() => remove(a.id)}>
                        Delete
                      </button>
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
