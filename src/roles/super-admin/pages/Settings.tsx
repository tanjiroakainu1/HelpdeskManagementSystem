import { FormEvent, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { STORAGE_KEY } from '@/lib/db';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const s = useAppDb().settings;
  const [form, setForm] = useState(s);

  useEffect(() => {
    setForm(s);
  }, [s]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.updateSettings(form, user?.id);
    refresh();
  };

  const resetDemo = () => {
    if (!window.confirm(`Reset all data in ${STORAGE_KEY}? This cannot be undone.`)) return;
    api.reseed();
    refresh();
    setForm(api.getDb().settings);
  };

  return (
    <>
      <PageHeader
        title="System Settings"
        description="Standalone configuration stored in browser localStorage — visible to all roles on this device."
      />
      <form className="card mb-4" onSubmit={submit}>
        <div className="card-body max-w-lg space-y-3">
          {(['siteName', 'slaEnabled', 'autoAssign', 'maxUploadMb'] as const).map((k) => (
            <div key={k}>
              <label className="form-label">{k}</label>
              <input className="form-input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
      <div className="card">
        <div className="card-header">
          <h2>Demo database</h2>
        </div>
        <div className="card-body max-w-lg space-y-3">
          <p className="text-sm text-muted">
            Reload the full seed dataset into <code className="text-candy-light">{STORAGE_KEY}</code>. All roles share
            this store.
          </p>
          <button type="button" className="btn-danger" onClick={resetDemo}>
            Reset demo data
          </button>
        </div>
      </div>
    </>
  );
}
