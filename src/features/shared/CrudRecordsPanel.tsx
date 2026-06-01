import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { ROLES } from '@/lib/roles';
import { SystemRecordsTable, systemRecordsPath } from './SystemRecordsTable';

/**
 * Shared activity table — every create/update/delete is logged to systemRecords
 * and is visible to all roles.
 */
export function CrudRecordsPanel({
  entityType = 'all',
  title,
  limit = 15,
}: {
  entityType?: string;
  title?: string;
  limit?: number;
}) {
  const { user } = useAuth();
  const db = useAppDb();
  const folder = user ? ROLES[user.role].folder : '';

  const records =
    entityType === 'all'
      ? [...db.systemRecords].slice(0, limit)
      : db.systemRecords.filter((r) => r.entityType === entityType).slice(0, limit);

  const panelTitle =
    title ??
    (entityType === 'all'
      ? 'Shared system activity (all roles)'
      : `Recent ${entityType} activity (all roles)`);

  return (
    <div className="card">
      <div className="card-header">
        <div className="min-w-0">
          <h2>{panelTitle}</h2>
          <p className="mt-1 text-xs text-muted">
            Create / update / delete log — every role sees the same system activity.
          </p>
        </div>
        <Link to={systemRecordsPath(folder)} className="link-accent shrink-0 text-sm max-sm:w-full max-sm:text-center">
          All records →
        </Link>
      </div>
      <div className="card-body card-body--flush-table">
        <SystemRecordsTable
          records={records}
          compact
          showViewAll
          viewAllHref={systemRecordsPath(folder)}
        />
      </div>
    </div>
  );
}
