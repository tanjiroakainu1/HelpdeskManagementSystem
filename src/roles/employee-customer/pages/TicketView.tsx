import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { AttachmentPreview } from '@/components/ui/AttachmentPreview';
import { formatFileSize } from '@/lib/files';
import { api, enrichTicket } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function TicketView() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const refresh = useRefresh();
  const db = useAppDb();
  const id = Number(params.get('id')) || db.tickets.filter((t) => t.requesterId === user?.id)[0]?.id;
  const ticket = id ? api.getTicket(id) : undefined;

  if (!ticket || ticket.requesterId !== user?.id) {
    return <p className="text-muted">Ticket not found.</p>;
  }

  const t = enrichTicket(ticket);
  const messages = api.getMessages(id, false);
  const attachments = api.getAttachments(id);
  const [msg, setMsg] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addMessage(id, user!.id, msg, false);
    setMsg('');
    refresh();
  };

  return (
    <>
      <PageHeader title={`${t.ticketCode} — ${t.subject}`} />
      <p className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={t.status} /> <PriorityBadge priority={t.priority} />
        {t.status === 'draft' && (
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => {
              api.submitDraftTicket(id, user!.id);
              refresh();
            }}
          >
            Submit draft to queue
          </button>
        )}
      </p>
      <div className="card mb-4">
        <div className="card-body">
          <p>{t.description}</p>
          {attachments.length > 0 && (
            <ul className="attachment-list mt-4">
              {attachments.map((a) => (
                <li key={a.id} className="attachment-list__item">
                  <AttachmentPreview
                    fileName={a.fileName}
                    mimeType={a.mimeType}
                    dataUrl={a.dataUrl}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200">{a.fileName}</p>
                    <p className="text-xs text-muted">{formatFileSize(a.fileSize)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body space-y-3">
          {messages.map((m) => {
            const u = api.getUser(m.userId);
            return (
              <div key={m.id} className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted">{u?.fullName}</p>
                <p>{m.message}</p>
              </div>
            );
          })}
        </div>
      </div>
      {t.status !== 'closed' && (
        <form className="card" onSubmit={submit}>
          <div className="card-body">
            <textarea className="form-input" value={msg} onChange={(e) => setMsg(e.target.value)} required />
            <button type="submit" className="btn-primary mt-2">Reply</button>
          </div>
        </form>
      )}
      {['resolved', 'closed'].includes(t.status) && (
        <Link to={`/employee-customer/feedback?ticketId=${id}`} className="btn-success">Rate Support</Link>
      )}
    </>
  );
}
