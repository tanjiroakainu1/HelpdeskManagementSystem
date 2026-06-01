import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { api } from '@/lib/api';

export default function Reports() {
  const s = api.ticketStats();
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
