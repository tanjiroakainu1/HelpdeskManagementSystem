import { PageHeader } from '@/components/ui/PageHeader';
import { AgentMessageForm } from '@/features/shared/AgentMessageForm';

export default function RespondInquiries() {
  return (
    <>
      <PageHeader title="Respond to Inquiries" />
      <AgentMessageForm />
    </>
  );
}
