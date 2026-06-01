import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { SaveNotice } from '@/components/ui/SaveNotice';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';
import { rolePath } from '@/lib/routes';
import { MSG } from '@/lib/userMessages';

export default function CreateArticles() {
  const refresh = useRefresh();
  const navigate = useNavigate();
  const { user } = useAuth();
  const db = useAppDb();
  const categories = db.kbCategories;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 1);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categories.length && !categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('Sign in as Knowledge Base Editor to create articles.');
      return;
    }
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!categories.length) {
      setError(MSG.noCategories);
      return;
    }

    const newId = api.addArticle({
      title: title.trim(),
      content: content.trim() || '(No content yet)',
      categoryId,
      status: 'draft',
      authorId: user.id,
    });

    if (!newId) {
      setError(MSG.saveFailedReset);
      return;
    }

    refresh();

    const savedArticle = api.getDb().knowledgeArticles.find((a) => a.id === newId);
    if (!savedArticle) {
      setError(MSG.saveNotPersisted);
      return;
    }

    setTitle('');
    setContent('');
    setSaved(true);
    setTimeout(() => setSaved(false), 5000);
    navigate(rolePath('knowledge-base-editor', 'edit-articles', { articleId: newId }));
  };

  return (
    <>
      <PageHeader title="Create Article" description="Saves as a draft — publish from Edit or Publish when ready." />
      <form className="card" onSubmit={submit}>
        <div className="card-body space-y-3">
          {!categories.length && (
            <p className="text-sm text-amber-200/90">{MSG.noCategories}</p>
          )}
          <input
            className="form-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="form-input min-h-[120px]"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <select
            className="form-input"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            disabled={!categories.length}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <SaveNotice show={saved}>{MSG.draftOpeningEditor}</SaveNotice>
          <button type="submit" className="btn-primary" disabled={!categories.length}>
            Create draft
          </button>
        </div>
      </form>
    </>
  );
}
