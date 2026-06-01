import { PageHeader } from '@/components/ui/PageHeader';
import { QaReviewForm } from '@/features/shared/QaReviewForm';
import { useAppDb } from '@/hooks/useAppDb';

export default function EvaluatePerformance() {
  const reviews = useAppDb().qaReviews;
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.qualityScore, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <>
      <PageHeader title="Evaluate Performance" description={`${reviews.length} reviews on record · avg ${avg}/5`} />
      <QaReviewForm title="Submit QA review" embedded />
    </>
  );
}
