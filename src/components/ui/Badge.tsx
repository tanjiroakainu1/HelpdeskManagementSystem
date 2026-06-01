import type { TicketPriority, TicketStatus } from '@/types';

const statusClass: Record<TicketStatus, string> = {
  draft: 'bg-surface-3/90 text-slate-300 ring-border/60',
  open: 'bg-candy/15 text-candy-light ring-candy/35',
  assigned: 'bg-galaxy/20 text-galaxy-dust ring-galaxy/40',
  in_progress: 'bg-galaxy-soft/15 text-galaxy-dust ring-galaxy-soft/35',
  pending_approval: 'bg-galaxy-nebula/25 text-galaxy-dust ring-galaxy/35',
  escalated: 'bg-red-500/15 text-red-300 ring-red-500/30',
  resolved: 'bg-candy-dark/20 text-candy-mint ring-candy/40',
  closed: 'bg-surface-3/80 text-muted ring-border/50',
  reopened: 'bg-candy-bright/15 text-candy-mint ring-candy-bright/35',
};

const priorityClass: Record<TicketPriority, string> = {
  low: 'bg-surface-3/80 text-muted ring-border/50',
  medium: 'bg-galaxy/15 text-galaxy-dust ring-galaxy/30',
  high: 'bg-candy-dark/15 text-candy-light ring-candy/35',
  critical: 'bg-red-500/15 text-red-300 ring-red-500/30',
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge ${statusClass[status]}`}>{status.replace(/_/g, ' ')}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`badge ${priorityClass[priority]}`}>{priority}</span>;
}

export function OpBadge({ operation }: { operation: string }) {
  const styles: Record<string, string> = {
    create: 'bg-candy/15 text-candy-mint ring-candy/35',
    update: 'bg-galaxy/20 text-galaxy-dust ring-galaxy/40',
    delete: 'bg-red-500/15 text-red-300 ring-red-500/30',
  };
  return (
    <span className={`badge ${styles[operation] ?? 'bg-surface-3/60 text-muted ring-border/40'}`}>
      {operation}
    </span>
  );
}
