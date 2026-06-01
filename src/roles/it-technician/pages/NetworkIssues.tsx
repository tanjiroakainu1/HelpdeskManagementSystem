import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function NetworkIssues() {
  const tickets = useAppDb().tickets.filter((t) => t.category === 'Network' && t.status !== 'closed');

  return (
    <>
      <PageHeader title="Network Issues" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={tickets} />
        </div>
      </div>
    </>
  );
}
