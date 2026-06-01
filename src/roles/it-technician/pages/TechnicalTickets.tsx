import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function TechnicalTickets() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const tickets = useAppDb().tickets.filter((t) => ['escalated', 'assigned', 'in_progress'].includes(t.status));
  return (
    <>
      <PageHeader title="Technical Tickets" />
      <div className="card"><div className="card-body"><TicketTable tickets={tickets} extraColumns={(t) => (
        <button type="button" className="btn-primary btn-sm" onClick={() => { api.assignTicket(t.id, user!.id, user!.id); refresh(); }}>Take</button>
      )} /></div></div>
    </>
  );
}
