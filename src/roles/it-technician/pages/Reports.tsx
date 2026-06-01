import { PageHeader } from '@/components/ui/PageHeader';
import { useAppDb } from '@/hooks/useAppDb';

export default function Reports() {
  const completed = useAppDb().repairLogs.filter((r) => r.status === 'completed').length;

  return <PageHeader title="Resolution Reports" description={`${completed} completed repairs`} />;
}
