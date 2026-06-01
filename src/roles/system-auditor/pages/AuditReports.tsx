import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { useAppDb } from '@/hooks/useAppDb';

export default function AuditReports() {
  const db = useAppDb();
  return (
    <>
      <PageHeader title="Audit Reports" />
      <StatGrid items={[
        { label: 'Logins', value: db.auditLogs.filter((l) => l.action === 'login').length },
        { label: 'Tickets', value: db.tickets.length },
        { label: 'Users', value: db.users.length },
        { label: 'Escalations', value: db.escalations.length },
      ]} />
    </>
  );
}
