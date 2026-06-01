import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';

export default function MyTickets() {
  const { user } = useAuth();
  const mine = useAppDb().tickets.filter((t) => t.assignedTo === user?.id);
  return (
    <>
      <PageHeader title="My Tickets" />
      <div className="card"><div className="card-body"><TicketTable tickets={mine} linkPrefix="/support-agent/respond-inquiries" /></div></div>
    </>
  );
}
