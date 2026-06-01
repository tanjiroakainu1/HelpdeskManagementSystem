import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { useAppDb } from '@/hooks/useAppDb';

export default function ServiceQuality() {
  const db = useAppDb();
  const reviews = db.qaReviews;
  const fb = db.feedback;
  const avgQa = reviews.length ? (reviews.reduce((s, r) => s + r.qualityScore, 0) / reviews.length).toFixed(1) : '—';
  const avgFb = fb.length ? (fb.reduce((s, r) => s + r.rating, 0) / fb.length).toFixed(1) : '—';
  return (
    <>
      <PageHeader title="Service Quality" />
      <StatGrid items={[{ label: 'Avg QA Score', value: avgQa, accent: true }, { label: 'Avg Rating', value: avgFb }, { label: 'Reviews', value: reviews.length }]} />
    </>
  );
}
