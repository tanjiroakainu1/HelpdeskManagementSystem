import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function Reviews() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const pending = useAppDb().tickets.filter((t) => t.status === 'closed' && !t.qaReviewed);
  const [ticketId, setTicketId] = useState(pending[0]?.id ?? 0);
  const [score, setScore] = useState(5);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addQaReview({ ticketId, reviewerId: user!.id, qualityScore: score, notes: '', recommendation: '' });
    refresh();
  };

  return (
    <>
      <PageHeader title="QA Reviews" />
      <form className="card" onSubmit={submit}><div className="card-body space-y-3">
        <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>{pending.map((t) => <option key={t.id} value={t.id}>{t.ticketCode}</option>)}</select>
        <select className="form-input" value={score} onChange={(e) => setScore(Number(e.target.value))}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        <button type="submit" className="btn-primary">Submit Review</button>
      </div></form>
    </>
  );
}
