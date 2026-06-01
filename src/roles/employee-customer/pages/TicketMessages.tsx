import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function TicketMessages() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const refresh = useRefresh();
  const db = useAppDb();
  const mine = db.tickets.filter((t) => t.requesterId === user?.id && t.status !== 'closed');
  const paramId = Number(params.get('id')) || 0;
  const [ticketId, setTicketId] = useState(paramId || mine[0]?.id || 0);
  const [msg, setMsg] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (paramId && mine.some((t) => t.id === paramId)) setTicketId(paramId);
  }, [paramId, mine]);

  const ticket = ticketId ? api.getTicket(ticketId) : undefined;
  const messages = ticketId ? api.getMessages(ticketId, false) : [];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !ticketId) return;
    api.addMessage(ticketId, user.id, msg, false);
    setMsg('');
    setSaved(true);
    refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <PageHeader title="Ticket Messages" description="View and send replies — saved in localStorage for all roles." />
      {!mine.length ? (
        <div className="card">
          <div className="card-body">
            <EmptyState title="No open tickets" description="Submit a ticket to start messaging support." icon="💬" />
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body space-y-3">
              <label className="form-label" htmlFor="msg-ticket">
                Ticket
              </label>
              <select
                id="msg-ticket"
                className="form-input"
                value={ticketId}
                onChange={(e) => setTicketId(Number(e.target.value))}
              >
                {mine.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.ticketCode} — {t.subject}
                  </option>
                ))}
              </select>
              <Link className="link-accent text-sm" to={`/employee-customer/ticket-view?id=${ticketId}`}>
                Open full ticket view →
              </Link>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted">No messages yet on {ticket?.ticketCode ?? 'this ticket'}.</p>
              )}
              {messages.map((m) => {
                const u = api.getUser(m.userId);
                return (
                  <div key={m.id} className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted">{u?.fullName}</p>
                    <p className="mt-1 text-slate-200">{m.message}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted">{m.createdAt.slice(0, 16)}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <form className="card" onSubmit={submit}>
            <div className="card-body">
              <label className="form-label" htmlFor="msg-body">
                Your reply
              </label>
              <textarea
                id="msg-body"
                className="form-input"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              />
              {saved && <p className="alert-success mt-2">Message saved.</p>}
              <button type="submit" className="btn-primary mt-3">
                Send reply
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
}
