import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function EscalateIssues() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const tickets = useAppDb().tickets;
  const [ticketId, setTicketId] = useState(tickets[0]?.id ?? 0);
  const [reason, setReason] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.createEscalation(ticketId, user!.id, 'help_desk_manager', reason);
    refresh();
  };

  return (
    <>
      <PageHeader title="Escalate Issues" />
      <form className="card" onSubmit={submit}><div className="card-body space-y-3">
        <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>{t.ticketCode} — {t.subject}</option>
          ))}
        </select>
        <textarea className="form-input" value={reason} onChange={(e) => setReason(e.target.value)} required />
        <button type="submit" className="btn-primary">Escalate</button>
      </div></form>
    </>
  );
}
