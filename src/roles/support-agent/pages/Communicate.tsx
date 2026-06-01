import { PageHeader } from '@/components/ui/PageHeader';
import { AgentMessageForm } from '@/features/shared/AgentMessageForm';

export default function Communicate() {
  return (
    <>
      <PageHeader title="Communicate with Requesters" />
      <AgentMessageForm />
    </>
  );
}
