import { FormEvent, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { ticketsForRole } from '@/lib/ticketsForRole';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function ResolveTicket() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const db = useAppDb();
  const tickets = user ? ticketsForRole(user, db).filter((t) => !['resolved', 'closed'].includes(t.status)) : [];
  const [ticketId, setTicketId] = useState(tickets[0]?.id ?? 0);

  useEffect(() => {
    if (tickets.length && !tickets.some((t) => t.id === ticketId)) setTicketId(tickets[0]?.id ?? 0);
  }, [tickets, ticketId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !ticketId) return;
    api.resolveTicket(ticketId, user.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Resolve Tickets" />
      {!tickets.length ? (
        <div className="card">
          <div className="card-body">
            <EmptyState title="No tickets to resolve" description="Take or get assigned a ticket first." icon="✓" />
          </div>
        </div>
      ) : (
        <form className="card" onSubmit={submit}>
          <div className="card-body space-y-3">
            <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.ticketCode} — {t.subject}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-success">
              Mark Resolved
            </button>
          </div>
        </form>
      )}
    </>
  );
}
