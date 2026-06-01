import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';

export default function ReviewResolved() {
  const { user } = useAuth();
  const tickets = useAppDb().tickets.filter((t) => t.departmentId === user?.departmentId && ['resolved', 'closed'].includes(t.status));
  return (
    <>
      <PageHeader title="Review Resolved" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={tickets} />
        </div>
      </div>
    </>
  );
}
