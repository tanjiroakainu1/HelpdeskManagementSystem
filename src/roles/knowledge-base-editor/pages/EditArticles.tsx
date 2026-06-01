import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function EditArticles() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const articles = useAppDb().knowledgeArticles;
  const [id, setId] = useState(articles[0]?.id ?? 0);
  const a = articles.find((x) => x.id === id);
  const [title, setTitle] = useState(a?.title ?? '');
  const [content, setContent] = useState(a?.content ?? '');

  const pick = (nid: number) => {
    setId(nid);
    const ar = articles.find((x) => x.id === nid);
    setTitle(ar?.title ?? '');
    setContent(ar?.content ?? '');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.updateArticle(id, { title, content }, user?.id);
    refresh();
  };

  const remove = () => {
    if (!window.confirm('Delete this article?')) return;
    api.deleteArticle(id, user?.id);
    const next = articles.find((x) => x.id !== id);
    if (next) pick(next.id);
    refresh();
  };

  return (
    <>
      <PageHeader title="Edit Articles" />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <select className="form-input" value={id} onChange={(e) => pick(Number(e.target.value))}>
            {articles.map((ar) => (
              <option key={ar.id} value={ar.id}>
                {ar.title}
              </option>
            ))}
          </select>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea
            className="form-input min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" className="btn-danger" onClick={remove}>
              Delete
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
