import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import { SaveNotice } from '@/components/ui/SaveNotice';
import { MSG } from '@/lib/userMessages';

export default function CoordinateSupport() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const db = useAppDb();
  const deptTickets = db.tickets.filter(
    (t) => t.departmentId === user?.departmentId && !['closed', 'draft'].includes(t.status),
  );
  const [ticketId, setTicketId] = useState(deptTickets[0]?.id ?? 0);
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !ticketId || !message.trim()) return;
    api.addMessage(ticketId, user.id, `[Dept head] ${message.trim()}`, true);
    refresh();
    setMessage('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const managers = db.users.filter((u) => u.role === 'help_desk_manager');
  const agents = db.users.filter((u) => u.role === 'support_agent');

  return (
    <>
      <PageHeader title="Coordinate with Support" />
      <div className="card mb-6">
        <div className="card-body text-sm">
          <p>
            <strong>Managers:</strong> {managers.map((u) => u.email).join(', ') || '—'}
          </p>
          <p className="mt-2">
            <strong>Agents:</strong> {agents.map((u) => u.email).join(', ') || '—'}
          </p>
        </div>
      </div>
      {deptTickets.length ? (
        <form className="card" onSubmit={send}>
          <div className="card-body space-y-3">
            <p className="text-sm text-muted">Add an internal note on a department ticket for the support team.</p>
            <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
              {deptTickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.ticketCode} — {t.subject}
                </option>
              ))}
            </select>
            <textarea
              className="form-input min-h-[80px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Coordination note for support team"
              required
            />
            <SaveNotice show={saved}>{MSG.noteSaved}</SaveNotice>
            <button type="submit" className="btn-primary">
              Save note
            </button>
          </div>
        </form>
      ) : (
        <p className="text-muted">No active department tickets to coordinate on.</p>
      )}
    </>
  );
}
