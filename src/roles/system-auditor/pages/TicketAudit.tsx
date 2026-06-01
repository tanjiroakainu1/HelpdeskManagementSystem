import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { useAppDb } from '@/hooks/useAppDb';

export default function TicketAudit() {
  const tickets = useAppDb().tickets;

  return (
    <>
      <PageHeader title="Ticket Audit" />
      <div className="card">
        <div className="card-body">
          <TicketTable
            tickets={tickets}
            extraColumns={(t) => (
              <span className="text-xs">
                {t.deptApproved ? 'D✓' : 'D—'} {t.supervisorApproved ? 'S✓' : 'S—'} {t.qaReviewed ? 'Q✓' : 'Q—'}
              </span>
            )}
          />
        </div>
      </div>
    </>
  );
}
