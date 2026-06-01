import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';
import { HelpdeskCharts } from '@/components/charts/HelpdeskCharts';
import { SystemRecordsTable } from './SystemRecordsTable';

const ENTITY_FILTERS = [
  'all',
  'ticket',
  'user',
  'department',
  'article',
  'category',
  'message',
  'attachment',
  'escalation',
  'asset',
  'repair',
  'feedback',
  'settings',
  'system',
] as const;

export default function SystemRecordsPage() {
  const db = useAppDb();
  const [filter, setFilter] = useState<string>('all');
  const [opFilter, setOpFilter] = useState<string>('all');

  const records = useMemo(() => {
    let list = [...db.systemRecords];
    if (filter !== 'all') list = list.filter((r) => r.entityType === filter);
    if (opFilter !== 'all') list = list.filter((r) => r.operation === opFilter);
    return list;
  }, [db.systemRecords, filter, opFilter]);

  return (
    <>
      <PageHeader
        title="System Records"
        description="Every create, update, and delete across the helpdesk — shared by all roles."
      />
      <HelpdeskCharts layout="compact" />
      <div className="card mb-6">
        <div className="card-body filter-bar">
          <div>
            <label className="form-label">Entity type</label>
            <select className="form-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {ENTITY_FILTERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Operation</label>
            <select className="form-input" value={opFilter} onChange={(e) => setOpFilter(e.target.value)}>
              <option value="all">all</option>
              <option value="create">create</option>
              <option value="update">update</option>
              <option value="delete">delete</option>
            </select>
          </div>
          <div className="filter-bar__stat">
            <span className="text-muted">Showing </span>
            <span className="font-mono font-semibold text-white">{records.length}</span>
            <span className="text-muted"> records</span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <SystemRecordsTable records={records} />
        </div>
      </div>
    </>
  );
}
