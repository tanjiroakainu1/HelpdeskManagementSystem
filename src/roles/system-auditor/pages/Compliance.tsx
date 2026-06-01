import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAppDb } from '@/hooks/useAppDb';

export default function Compliance() {
  const db = useAppDb();
  const issues: string[] = [];
  const noSup = db.tickets.filter((t) => t.status === 'closed' && !t.supervisorApproved).length;
  if (noSup) issues.push(`${noSup} closed without supervisor approval`);
  const sla = api.ticketStats().slaBreach;
  if (sla) issues.push(`${sla} SLA breaches active`);

  return (
    <>
      <PageHeader title="Compliance" />
      <div className="card">
        <div className="card-body">
          {issues.length ? (
            issues.map((i) => (
              <p key={i} className="mb-2 text-red-300">
                {i}
              </p>
            ))
          ) : (
            <p className="text-emerald-400">No critical issues.</p>
          )}
        </div>
      </div>
    </>
  );
}
