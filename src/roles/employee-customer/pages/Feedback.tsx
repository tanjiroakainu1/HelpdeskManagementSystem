import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function Feedback() {
  const [params] = useSearchParams();
  const refresh = useRefresh();
  const { user } = useAuth();
  const closed = useAppDb().tickets.filter((t) => t.requesterId === user?.id && ['resolved', 'closed'].includes(t.status));
  const [ticketId, setTicketId] = useState(Number(params.get('ticketId')) || closed[0]?.id || 0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addFeedback({ ticketId, userId: user!.id, rating, comment });
    refresh();
  };

  return (
    <>
      <PageHeader title="Feedback" />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <select className="form-input" value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))}>
            {closed.map((t) => (
              <option key={t.id} value={t.id}>{t.ticketCode}</option>
            ))}
          </select>
          <select className="form-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} stars</option>
            ))}
          </select>
          <textarea className="form-input" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button type="submit" className="btn-primary">Submit</button>
        </div>
      </form>
    </>
  );
}
