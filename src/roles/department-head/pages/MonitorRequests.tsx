import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';

export default function MonitorRequests() {
  const { user } = useAuth();
  const tickets = useAppDb().tickets.filter((t) => t.departmentId === user?.departmentId);
  return (
    <>
      <PageHeader title="Monitor Department Requests" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={tickets} />
        </div>
      </div>
    </>
  );
}
