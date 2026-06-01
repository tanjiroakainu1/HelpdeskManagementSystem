import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function SoftwareTroubleshoot() {
  const tickets = useAppDb().tickets.filter(
    (t) => ['Software', 'General'].includes(t.category) && t.status !== 'closed',
  );

  return (
    <>
      <PageHeader title="Software Troubleshooting" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={tickets} />
        </div>
      </div>
    </>
  );
}
