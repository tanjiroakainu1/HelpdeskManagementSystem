import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';

export default function EvaluatePerformance() {
  const reviews = useAppDb().qaReviews;
  return (
    <>
      <PageHeader title="Evaluate Performance" />
      <div className="card"><div className="card-body"><p className="text-muted">{reviews.length} QA reviews on record.</p></div></div>
    </>
  );
}
