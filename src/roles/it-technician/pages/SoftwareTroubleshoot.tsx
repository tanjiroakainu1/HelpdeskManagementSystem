import { PageHeader } from '@/components/ui/PageHeader';
import { TicketQuickActions } from '@/features/shared/TicketQuickActions';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function SoftwareTroubleshoot() {
  const tickets = useAppDb().tickets.filter(
    (t) => ['Software', 'General'].includes(t.category) && !['closed', 'draft'].includes(t.status),
  );

  return (
    <>
      <PageHeader title="Software Troubleshooting" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <TicketTable tickets={tickets} extraColumns={(t) => <TicketQuickActions ticketId={t.id} />} />
        </div>
      </div>
    </>
  );
}
