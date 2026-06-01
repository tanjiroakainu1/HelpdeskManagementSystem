import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { useAppDb } from '@/hooks/useAppDb';

export default function Reports() {
  const db = useAppDb();
  const t = db.tickets;
  const s = {
    total: t.length,
    open: t.filter((x) => !['closed', 'resolved', 'draft'].includes(x.status)).length,
    resolved: t.filter((x) => ['resolved', 'closed'].includes(x.status)).length,
    slaBreach: t.filter(
      (x) =>
        x.slaDueAt &&
        new Date(x.slaDueAt).getTime() < Date.now() &&
        !['resolved', 'closed', 'draft'].includes(x.status),
    ).length,
  };
  return (
    <>
      <PageHeader title="System Reports" />
      <StatGrid items={[
        { label: 'Total', value: s.total },
        { label: 'Open', value: s.open },
        { label: 'Resolved', value: s.resolved },
      ]} />
    </>
  );
}
