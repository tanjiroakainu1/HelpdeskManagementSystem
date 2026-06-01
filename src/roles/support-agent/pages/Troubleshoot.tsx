import { PageHeader } from '@/components/ui/PageHeader';
import { AgentMessageForm } from '@/features/shared/AgentMessageForm';

export default function Troubleshoot() {
  return (
    <>
      <PageHeader title="Troubleshoot" description="Internal notes" />
      <AgentMessageForm internal />
    </>
  );
}
