import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';

export default function SecurityConcerns() {
  const logs = useAppDb()
    .auditLogs.filter((l) => ['login', 'logout'].includes(l.action))
    .slice(0, 20);

  return (
    <>
      <PageHeader title="Security" />
      <div className="card">
        <div className="card-body text-sm">
          {logs.map((l) => (
            <p key={l.id} className="border-b border-border py-1">
              {l.action} — {l.details} — {l.ipAddress}
            </p>
          ))}
          {!logs.length && <p className="text-muted">No login activity logged yet.</p>}
        </div>
      </div>
    </>
  );
}
