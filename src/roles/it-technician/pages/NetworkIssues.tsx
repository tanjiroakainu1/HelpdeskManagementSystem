import { PageHeader } from '@/components/ui/PageHeader';
import { TicketQuickActions } from '@/features/shared/TicketQuickActions';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function NetworkIssues() {
  const tickets = useAppDb().tickets.filter((t) => t.category === 'Network' && !['closed', 'draft'].includes(t.status));

  return (
    <>
      <PageHeader title="Network Issues" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <TicketTable tickets={tickets} extraColumns={(t) => <TicketQuickActions ticketId={t.id} />} />
        </div>
      </div>
    </>
  );
}
