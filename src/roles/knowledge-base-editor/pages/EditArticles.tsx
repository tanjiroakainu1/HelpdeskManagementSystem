import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import { SaveNotice } from '@/components/ui/SaveNotice';
import { MSG } from '@/lib/userMessages';

export default function EditArticles() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const articles = useAppDb().knowledgeArticles;
  const initialId = Number(searchParams.get('articleId')) || articles[0]?.id || 0;
  const [id, setId] = useState(initialId);
  const a = articles.find((x) => x.id === id);
  const [title, setTitle] = useState(a?.title ?? '');
  const [content, setContent] = useState(a?.content ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const ar = articles.find((x) => x.id === id);
    if (ar) {
      setTitle(ar.title);
      setContent(ar.content);
    }
  }, [id, articles]);

  useEffect(() => {
    const paramId = Number(searchParams.get('articleId'));
    if (paramId && articles.some((x) => x.id === paramId)) {
      setId(paramId);
    }
  }, [searchParams, articles]);

  const pick = (nid: number) => {
    setId(nid);
    const ar = articles.find((x) => x.id === nid);
    setTitle(ar?.title ?? '');
    setContent(ar?.content ?? '');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    api.updateArticle(id, { title, content }, user?.id);
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const saveDraftOnly = () => {
    if (!id) return;
    api.updateArticle(id, { title, content, status: 'draft' }, user?.id);
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const remove = () => {
    if (!window.confirm('Delete this article?')) return;
    api.deleteArticle(id, user?.id);
    const next = articles.find((x) => x.id !== id);
    if (next) pick(next.id);
    refresh();
  };

  if (!articles.length) {
    return (
      <>
        <PageHeader title="Edit Articles" />
        <p className="text-muted">No articles yet. Create a draft first.</p>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Edit Articles" />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          <select className="form-input" value={id} onChange={(e) => pick(Number(e.target.value))}>
            {articles.map((ar) => (
              <option key={ar.id} value={ar.id}>
                {ar.title} ({ar.status})
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
          <SaveNotice show={saved}>{MSG.changesSaved}</SaveNotice>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary">
              Save changes
            </button>
            <button type="button" className="btn-secondary" onClick={saveDraftOnly}>
              Save as draft
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
