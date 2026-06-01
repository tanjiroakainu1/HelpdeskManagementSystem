import { PageHeader } from '@/components/ui/PageHeader';
import { AgentMessageForm } from '@/features/shared/AgentMessageForm';

export default function TicketNotes() {
  return (
    <>
      <PageHeader title="Ticket Notes" />
      <AgentMessageForm internal />
    </>
  );
}
