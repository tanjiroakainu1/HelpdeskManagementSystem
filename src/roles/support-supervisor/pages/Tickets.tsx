import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function Tickets() {
  const tickets = useAppDb().tickets.filter((t) => t.status !== 'closed');

  return (
    <>
      <PageHeader title="Ticket Progress" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={tickets} />
        </div>
      </div>
    </>
  );
}
