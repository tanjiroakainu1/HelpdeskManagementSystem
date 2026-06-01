import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';

export default function CreateArticles() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    api.addArticle({ title, content, categoryId: 1, status: 'draft', authorId: user!.id });
    refresh();
  };

  return (
    <>
      <PageHeader title="Create Article" />
      <form className="card" onSubmit={submit}><div className="card-body space-y-3">
        <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="form-input min-h-[120px]" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit" className="btn-primary">Create Draft</button>
      </div></form>
    </>
  );
}
