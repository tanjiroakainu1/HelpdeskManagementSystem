import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { EmptyState } from '@/components/ui/EmptyState';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { useDb } from '@/context/DataContext';
import { enrichTicket } from '@/lib/api';
import type { Ticket } from '@/types';

export function TicketTable({
  tickets,
  linkPrefix,
  extraColumns,
}: {
  tickets: Ticket[];
  linkPrefix?: string;
  extraColumns?: (t: ReturnType<typeof enrichTicket>) => ReactNode;
}) {
  useDb();

  if (!tickets.length) {
    return <EmptyState title="No tickets" description="Tickets matching this view will appear here." icon="🎫" />;
  }

  const hasActions = !!(extraColumns || linkPrefix);

  return (
    <DataTableWrap>
      <table className="data-table data-table--stack">
        <thead>
          <tr>
            <th>Code</th>
            <th>Subject</th>
            <th>Requester</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tickets.map((raw) => {
            const t = enrichTicket(raw);
            return (
              <tr key={t.id}>
                <td data-label="Code" className="font-mono text-xs font-medium text-accent-soft">
                  {t.ticketCode}
                </td>
                <td data-label="Subject" className="font-medium text-slate-200 sm:max-w-[200px] sm:truncate" title={t.subject}>
                  {t.subject}
                </td>
                <td data-label="Requester" className="text-muted">
                  {t.requesterName}
                </td>
                <td data-label="Status">
                  <StatusBadge status={t.status} />
                </td>
                <td data-label="Priority">
                  <PriorityBadge priority={t.priority} />
                </td>
                <td data-label="Assignee" className="text-muted">
                  {t.assigneeName}
                </td>
                {extraColumns && (
                  <td data-label="Actions">{extraColumns(t)}</td>
                )}
                {linkPrefix && !extraColumns && (
                  <td data-label="Actions">
                    <Link className="link-accent text-xs" to={`${linkPrefix}?id=${t.id}`}>
                      View →
                    </Link>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </DataTableWrap>
  );
}
