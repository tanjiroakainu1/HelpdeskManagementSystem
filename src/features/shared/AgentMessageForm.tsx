import { FormEvent, useEffect, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { ticketsForRole } from '@/lib/ticketsForRole';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import { SaveNotice } from '@/components/ui/SaveNotice';
import { MSG } from '@/lib/userMessages';

export function AgentMessageForm({ internal }: { internal?: boolean }) {
  const { user } = useAuth();
  const refresh = useRefresh();
  const db = useAppDb();
  const tickets = user ? ticketsForRole(user, db) : [];
  const [ticketId, setTicketId] = useState(tickets[0]?.id ?? 0);
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tickets.length && !tickets.some((t) => t.id === ticketId)) {
      setTicketId(tickets[0]?.id ?? 0);
    }
  }, [tickets, ticketId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !ticketId) return;
    api.addMessage(ticketId, user.id, message, !!internal);
    if (!internal) api.updateTicketStatus(ticketId, 'in_progress', user.id);
    setMessage('');
    setSaved(true);
    refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  if (!tickets.length) {
    return (
      <div className="card">
        <div className="card-body">
          <EmptyState
            title="No tickets available"
            description="Assign or take a ticket first, then return here to add messages."
            icon="💬"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="card-body space-y-3">
        <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.ticketCode} — {t.subject}
            </option>
          ))}
        </select>
        <textarea
          className="form-input min-h-[100px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <SaveNotice show={saved}>{MSG.messageSaved}</SaveNotice>
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
