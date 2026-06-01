import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { useAppDb } from '@/hooks/useAppDb';

export default function Operations() {
  const db = useAppDb();
  const t = db.tickets;
  const s = {
    open: t.filter((x) => !['closed', 'resolved', 'draft'].includes(x.status)).length,
    escalated: t.filter((x) => x.status === 'escalated').length,
    slaBreach: t.filter(
      (x) =>
        x.slaDueAt &&
        new Date(x.slaDueAt).getTime() < Date.now() &&
        !['resolved', 'closed', 'draft'].includes(x.status),
    ).length,
  };
  return (
    <>
      <PageHeader title="Operations Overview" />
      <StatGrid items={[{ label: 'Open', value: s.open, accent: true }, { label: 'Escalated', value: s.escalated }, { label: 'SLA Breach', value: s.slaBreach, danger: true }]} />
    </>
  );
}
