import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function Categories() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const categories = useAppDb().kbCategories;
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addKbCategory(name, user?.id);
    setName('');
    refresh();
  };

  const saveEdit = () => {
    if (editingId == null) return;
    api.updateKbCategory(editingId, editName, user?.id);
    setEditingId(null);
    refresh();
  };

  const remove = (id: number) => {
    if (!window.confirm('Delete this category?')) return;
    api.deleteKbCategory(id, user?.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Categories" description="Knowledge base categories — visible to all roles." />
      <form className="card mb-4" onSubmit={submit}>
        <div className="card-body flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="form-input flex-1"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    {editingId === c.id ? (
                      <>
                        <td data-label="Name" className="p-2">
                          <input className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </td>
                        <td data-label="Slug" className="p-2 text-muted">
                          {c.slug}
                        </td>
                        <td data-label="Actions" className="p-2">
                          <div className="flex gap-2">
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
                        <td data-label="Name" className="p-2">
                          {c.name}
                        </td>
                        <td data-label="Slug" className="p-2 font-mono text-xs text-muted">
                          {c.slug}
                        </td>
                        <td data-label="Actions" className="p-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="btn-ghost btn-sm"
                              onClick={() => {
                                setEditingId(c.id);
                                setEditName(c.name);
                              }}
                            >
                              Edit
                            </button>
                            <button type="button" className="btn-danger btn-sm" onClick={() => remove(c.id)}>
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
