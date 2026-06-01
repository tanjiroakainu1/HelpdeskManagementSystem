import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function Faqs() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const faqs = useAppDb().knowledgeArticles.filter((x) => x.title.startsWith('FAQ:'));
  const [q, setQ] = useState('');
  const [a, setA] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addArticle({ title: `FAQ: ${q}`, content: a, categoryId: 1, status: 'published', authorId: user!.id });
    setQ('');
    setA('');
    refresh();
  };

  return (
    <>
      <PageHeader title="FAQs" />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <input className="form-input" placeholder="Question" value={q} onChange={(e) => setQ(e.target.value)} required />
          <textarea className="form-input" value={a} onChange={(e) => setA(e.target.value)} required />
          <button type="submit" className="btn-primary">
            Publish FAQ
          </button>
        </div>
      </form>
      <div className="card mt-4">
        <div className="card-body space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="flex flex-col gap-2 border-b border-border py-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <strong className="text-slate-200">{f.title.replace(/^FAQ:\s*/, '')}</strong>
                <p className="mt-1 text-sm text-muted">{f.content}</p>
              </div>
              <button
                type="button"
                className="btn-danger btn-sm shrink-0"
                onClick={() => {
                  if (window.confirm('Delete this FAQ?')) {
                    api.deleteArticle(f.id, user?.id);
                    refresh();
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
