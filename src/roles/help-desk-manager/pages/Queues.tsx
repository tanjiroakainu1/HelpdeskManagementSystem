import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';

export default function Queues() {
  const tickets = useAppDb().tickets.filter((t) => !['closed', 'resolved', 'draft'].includes(t.status));
  const groups: Record<string, number> = {};
  tickets.forEach((t) => {
    const k = `${t.status}-${t.priority}`;
    groups[k] = (groups[k] ?? 0) + 1;
  });
  return (
    <>
      <PageHeader title="Ticket Queues" />
      <div className="card">
        <div className="card-body">
          <ul>
            {Object.entries(groups).map(([k, v]) => (
              <li key={k} className="border-b border-border py-2">{k}: {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
