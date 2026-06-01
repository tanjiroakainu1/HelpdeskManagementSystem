import { FormEvent, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import { SaveNotice } from '@/components/ui/SaveNotice';
import { MSG } from '@/lib/userMessages';

export function QaReviewForm({ title = 'QA Review', embedded }: { title?: string; embedded?: boolean }) {
  const refresh = useRefresh();
  const { user } = useAuth();
  const pending = useAppDb().tickets.filter((t) => t.status === 'closed' && !t.qaReviewed);
  const [ticketId, setTicketId] = useState(pending[0]?.id ?? 0);
  const [score, setScore] = useState(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (pending.length && !pending.some((t) => t.id === ticketId)) {
      setTicketId(pending[0]?.id ?? 0);
    }
  }, [pending, ticketId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !ticketId) return;
    api.addQaReview({ ticketId, reviewerId: user.id, qualityScore: score, notes: '', recommendation: '' });
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!pending.length) {
    return (
      <>
        {!embedded && <PageHeader title={title} />}
        <div className="card">
          <div className="card-body">
            <EmptyState title="No tickets awaiting QA" description="Closed tickets appear here after supervisor approval." icon="✓" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {!embedded && <PageHeader title={title} />}
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
            {pending.map((t) => (
              <option key={t.id} value={t.id}>
                {t.ticketCode} — {t.subject}
              </option>
            ))}
          </select>
          <label className="text-sm text-muted">
            Quality score (1–5)
            <input
              type="range"
              min={1}
              max={5}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <span className="ml-2 font-medium text-candy-light">{score}</span>
          </label>
          <SaveNotice show={saved}>{MSG.reviewSaved}</SaveNotice>
          <button type="submit" className="btn-primary">
            Save review
          </button>
        </div>
      </form>
    </>
  );
}
