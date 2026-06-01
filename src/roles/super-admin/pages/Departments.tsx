import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';
import { useAuth } from '@/context/AuthContext';

export default function Departments() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const deps = useAppDb().departments;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addDepartment(name, description, user?.id);
    setName('');
    setDescription('');
    refresh();
  };

  const startEdit = (id: number) => {
    const d = deps.find((x) => x.id === id);
    if (!d) return;
    setEditingId(id);
    setEditName(d.name);
    setEditDescription(d.description ?? '');
  };

  const saveEdit = () => {
    if (editingId == null) return;
    api.updateDepartment(editingId, { name: editName, description: editDescription }, user?.id);
    setEditingId(null);
    refresh();
  };

  const remove = (id: number) => {
    if (!window.confirm('Delete this department?')) return;
    api.deleteDepartment(id, user?.id);
    if (editingId === id) setEditingId(null);
    refresh();
  };

  return (
    <>
      <PageHeader title="Departments" description="Manage departments — shared across all roles." />
      <form className="card mb-4" onSubmit={submit}>
        <div className="card-header">
          <h2>Add department</h2>
        </div>
        <div className="card-body space-y-3">
          <input
            className="form-input"
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="form-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="btn-primary">
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deps.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    {editingId === d.id ? (
                      <>
                        <td data-label="Name" className="p-2">
                          <input
                            className="form-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </td>
                        <td data-label="Description" className="p-2">
                          <input
                            className="form-input"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </td>
                        <td data-label="Actions" className="p-2">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className="btn-primary btn-sm" onClick={saveEdit}>
                              Save
                            </button>
                            <button type="button" className="btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td data-label="Name" className="p-2 font-medium text-slate-200">
                          {d.name}
                        </td>
                        <td data-label="Description" className="p-2 text-muted">
                          {d.description || '—'}
                        </td>
                        <td data-label="Actions" className="p-2">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className="btn-ghost btn-sm" onClick={() => startEdit(d.id)}>
                              Edit
                            </button>
                            <button type="button" className="btn-danger btn-sm" onClick={() => remove(d.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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
