import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';
import { rolePath } from '@/lib/routes';

export default function UpdateArticles() {
  const articles = useAppDb().knowledgeArticles;
  const stale = articles.filter(
    (a) => a.status === 'draft' || new Date(a.updatedAt) < new Date(Date.now() - 90 * 86400000),
  );

  return (
    <>
      <PageHeader title="Update Outdated" />
      <div className="card">
        <div className="card-body">
          <ul className="space-y-2">
            {stale.map((a) => (
              <li key={a.id}>
                <Link to={rolePath('knowledge-base-editor', 'edit-articles', { articleId: a.id })} className="link-accent">
                  {a.title}
                </Link>
                <span className="ml-2 text-xs text-muted">({a.status})</span>
              </li>
            ))}
            {!stale.length && <p className="text-muted">No outdated articles.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
