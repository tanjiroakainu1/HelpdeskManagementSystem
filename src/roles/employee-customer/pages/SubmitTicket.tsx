import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import type { TicketPriority } from '@/types';

export default function SubmitTicket() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = api.createTicket({
      subject,
      description,
      category: 'General',
      priority,
      requesterId: user!.id,
      departmentId: user!.departmentId,
    });
    refresh();
    navigate(`/employee-customer/ticket-view?id=${t.id}`);
  };

  return (
    <>
      <PageHeader title="Submit Ticket" />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <input className="form-input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <textarea className="form-input min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <button type="submit" className="btn-primary">Submit</button>
        </div>
      </form>
    </>
  );
}
