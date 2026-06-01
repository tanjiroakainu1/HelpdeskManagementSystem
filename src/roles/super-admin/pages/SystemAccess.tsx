import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { api } from '@/lib/api';
import { useAppDb } from '@/hooks/useAppDb';

export default function SystemAccess() {
  const db = useAppDb();
  const s = api.ticketStats();
  return (
    <>
      <PageHeader title="Full System Access" description="Central overview of all modules" />
      <StatGrid items={[
        { label: 'Tickets', value: s.total },
        { label: 'Users', value: db.users.length },
        { label: 'Departments', value: db.departments.length },
        { label: 'KB Articles', value: db.knowledgeArticles.length },
      ]} />
    </>
  );
}
