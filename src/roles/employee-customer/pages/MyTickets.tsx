import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';

export default function MyTickets() {
  const { user } = useAuth();
  const mine = useAppDb().tickets.filter((t) => t.requesterId === user?.id);
  return (
    <>
      <PageHeader title="My Tickets" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={mine} linkPrefix="/employee-customer/ticket-view" />
        </div>
      </div>
    </>
  );
}
