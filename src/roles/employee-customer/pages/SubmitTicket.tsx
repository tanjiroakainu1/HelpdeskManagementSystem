import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { rolePath } from '@/lib/routes';
import { SaveNotice } from '@/components/ui/SaveNotice';
import { MSG } from '@/lib/userMessages';
import type { TicketPriority } from '@/types';

export default function SubmitTicket() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [category, setCategory] = useState('General');
  const [savedDraft, setSavedDraft] = useState(false);
  const navigate = useNavigate();

  const payload = () => ({
    subject,
    description,
    category,
    priority,
    requesterId: user!.id,
    departmentId: user!.departmentId,
  });

  const saveDraft = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim()) return;
    const t = api.createTicketDraft(payload());
    refresh();
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
    navigate(rolePath('employee-customer', 'ticket-view', { id: t.id }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const t = api.createTicket({ ...payload() });
    refresh();
    navigate(rolePath('employee-customer', 'ticket-view', { id: t.id }));
  };

  return (
    <>
      <PageHeader title="Submit Ticket" description="Save a draft to finish later, or submit to open the ticket queue." />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <input
            className="form-input"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            className="form-input min-h-[120px]"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Hardware">Hardware</option>
          </select>
          <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <SaveNotice show={savedDraft}>{MSG.draftSavedPrivate}</SaveNotice>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={saveDraft}>
              Save as draft
            </button>
            <button type="submit" className="btn-primary">
              Submit ticket
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
