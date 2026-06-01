import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { api } from '@/lib/api';

export default function Operations() {
  const s = api.ticketStats();
  return (
    <>
      <PageHeader title="Operations Overview" />
      <StatGrid items={[{ label: 'Open', value: s.open, accent: true }, { label: 'Escalated', value: s.escalated }, { label: 'SLA Breach', value: s.slaBreach, danger: true }]} />
    </>
  );
}
