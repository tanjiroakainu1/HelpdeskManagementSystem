import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function ReopenTicket() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const closed = useAppDb().tickets.filter((t) => t.requesterId === user?.id && ['resolved', 'closed'].includes(t.status));
  const [ticketId, setTicketId] = useState(closed[0]?.id ?? 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.updateTicketStatus(ticketId, 'reopened', user!.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Reopen Ticket" />
      <form className="card" onSubmit={submit}>
        <div className="card-body">
          <select className="form-input mb-3" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
            {closed.map((t) => (
              <option key={t.id} value={t.id}>{t.ticketCode}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Reopen</button>
        </div>
      </form>
    </>
  );
}
