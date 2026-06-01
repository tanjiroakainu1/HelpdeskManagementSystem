import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function PublishArticles() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const articles = useAppDb().knowledgeArticles;

  return (
    <>
      <PageHeader title="Publish & Archive" />
      <div className="card">
        <div className="card-body space-y-2">
          {articles.map((a) => (
            <div key={a.id} className="list-item">
              <span className="min-w-0 font-medium text-slate-200">
                {a.title}
                <span className="mt-1 block text-xs capitalize text-muted sm:mt-0 sm:inline"> — {a.status}</span>
              </span>
              <select
                className="form-input w-full py-2 sm:w-auto sm:min-w-[9rem] sm:py-1"
                value={a.status}
                onChange={(e) => {
                  api.updateArticle(a.id, { status: e.target.value as 'draft' | 'published' | 'archived' }, user?.id);
                  refresh();
                }}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
