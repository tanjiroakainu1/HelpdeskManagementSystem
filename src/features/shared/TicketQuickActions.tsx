import { FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import type { TicketStatus } from '@/types';

const STATUS_OPTIONS: TicketStatus[] = [
  'assigned',
  'in_progress',
  'escalated',
  'resolved',
];

export function TicketQuickActions({
  ticketId,
  showTake = true,
  showStatus = true,
}: {
  ticketId: number;
  showTake?: boolean;
  showStatus?: boolean;
}) {
  const { user } = useAuth();
  const refresh = useRefresh();

  if (!user) return null;

  const onStatus = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const status = fd.get('status') as TicketStatus;
    api.updateTicketStatus(ticketId, status, user.id);
    refresh();
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {showTake && (
        <button
          type="button"
          className="btn-primary btn-sm w-full sm:w-auto"
          onClick={() => {
            api.assignTicket(ticketId, user.id, user.id);
            api.updateTicketStatus(ticketId, 'in_progress', user.id);
            refresh();
          }}
        >
          Take
        </button>
      )}
      {showStatus && (
        <form onSubmit={onStatus} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select name="status" className="form-input w-full py-1 sm:w-36" defaultValue="in_progress">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-secondary btn-sm w-full sm:w-auto">
            Set status
          </button>
        </form>
      )}
    </div>
  );
}
