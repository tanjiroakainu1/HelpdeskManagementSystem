import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { useAppDb } from '@/hooks/useAppDb';

export default function Reports() {
  const reviews = useAppDb().qaReviews;
  const avgQa = reviews.length ? (reviews.reduce((s, r) => s + r.qualityScore, 0) / reviews.length).toFixed(1) : '—';
  return (
    <>
      <PageHeader title="Quality Reports" />
      <StatGrid items={[{ label: 'Avg QA Score', value: avgQa, accent: true }, { label: 'Reviews', value: reviews.length }]} />
    </>
  );
}
