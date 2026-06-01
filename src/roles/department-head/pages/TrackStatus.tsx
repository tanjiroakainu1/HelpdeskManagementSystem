import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import type { TicketStatus } from '@/types';

export default function TrackStatus() {
  const { user } = useAuth();
  const tickets = useAppDb().tickets.filter((t) => t.departmentId === user?.departmentId);
  const groups: Record<string, number> = {};
  tickets.forEach((t) => { groups[t.status] = (groups[t.status] ?? 0) + 1; });
  return (
    <>
      <PageHeader title="Track Status" />
      <div className="card">
        <div className="card-body">
          <ul>
            {Object.entries(groups).map(([s, c]) => (
              <li key={s} className="py-2"><StatusBadge status={s as TicketStatus} /> — {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
