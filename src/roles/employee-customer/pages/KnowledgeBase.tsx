import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';

export default function KnowledgeBase() {
  const articles = useAppDb().knowledgeArticles.filter((a) => a.status === 'published');
  const [sel, setSel] = useState<number | null>(null);
  const article = sel ? articles.find((a) => a.id === sel) : null;

  return (
    <>
      <PageHeader title="Knowledge Base" />
      {article ? (
        <div className="card">
          <div className="card-header">
            <h2 className="min-w-0 break-words">{article.title}</h2>
            <button type="button" className="btn-ghost btn-sm w-full sm:w-auto" onClick={() => setSel(null)}>Back</button>
          </div>
          <div className="card-body"><p>{article.content}</p></div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body space-y-3">
            {articles.map((a) => (
              <button key={a.id} type="button" className="link-accent block w-full text-left hover:underline" onClick={() => setSel(a.id)}>
                {a.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
