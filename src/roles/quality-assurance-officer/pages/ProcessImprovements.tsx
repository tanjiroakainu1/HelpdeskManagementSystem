import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function ProcessImprovements() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const recs = useAppDb().auditLogs.filter((l) => l.action === 'qa_recommendation');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addQaRecommendation(user!.id, text);
    setText('');
    refresh();
  };

  return (
    <>
      <PageHeader title="Process Improvements" />
      <form className="card" onSubmit={submit}><div className="card-body"><textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} required /><button type="submit" className="btn-primary mt-2">Submit</button></div></form>
      <div className="card mt-4"><div className="card-body"><ul>{recs.map((r) => <li key={r.id} className="py-2">{r.details}</li>)}</ul></div></div>
    </>
  );
}
