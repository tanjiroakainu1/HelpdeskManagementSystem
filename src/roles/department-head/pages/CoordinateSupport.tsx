import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';

export default function CoordinateSupport() {
  const db = useAppDb();
  const managers = db.users.filter((u) => u.role === 'help_desk_manager');
  const agents = db.users.filter((u) => u.role === 'support_agent');

  return (
    <>
      <PageHeader title="Coordinate with Support" />
      <div className="card">
        <div className="card-body text-sm">
          <p>Managers: {managers.map((u) => u.email).join(', ') || '—'}</p>
          <p className="mt-2">Agents: {agents.map((u) => u.email).join(', ') || '—'}</p>
        </div>
      </div>
    </>
  );
}
