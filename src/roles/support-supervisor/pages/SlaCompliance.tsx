import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function SlaCompliance() {
  const breaches = useAppDb().tickets.filter(
    (t) => t.slaDueAt && new Date(t.slaDueAt) < new Date() && !['resolved', 'closed'].includes(t.status),
  );

  return (
    <>
      <PageHeader title="SLA Compliance" />
      <div className="card">
        <div className="card-body">
          <TicketTable tickets={breaches} />
        </div>
      </div>
    </>
  );
}
