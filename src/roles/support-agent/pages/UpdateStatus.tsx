import { FormEvent, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { ticketsForRole } from '@/lib/ticketsForRole';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';
import type { TicketStatus } from '@/types';

export default function UpdateStatus() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const db = useAppDb();
  const tickets = user ? ticketsForRole(user, db) : [];
  const [ticketId, setTicketId] = useState(tickets[0]?.id ?? 0);
  const [status, setStatus] = useState<TicketStatus>('in_progress');

  useEffect(() => {
    if (tickets.length && !tickets.some((t) => t.id === ticketId)) setTicketId(tickets[0]?.id ?? 0);
  }, [tickets, ticketId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !ticketId) return;
    api.updateTicketStatus(ticketId, status, user.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Update Status" />
      {!tickets.length ? (
        <div className="card">
          <div className="card-body">
            <EmptyState title="No tickets" description="Assign or take a ticket to update status." icon="📋" />
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
            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
              <option value="in_progress">In Progress</option>
              <option value="assigned">Assigned</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="open">Open</option>
            </select>
            <button type="submit" className="btn-primary">
              Update
            </button>
          </div>
        </form>
      )}
    </>
  );
}
