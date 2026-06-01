import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function MyTickets() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const mine = useAppDb().tickets.filter((t) => t.requesterId === user?.id);

  return (
    <>
      <PageHeader title="My Tickets" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <TicketTable
            tickets={mine}
            linkPrefix="/employee-customer/ticket-view"
            extraColumns={(t) =>
              t.status === 'draft' ? (
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => {
                    api.submitDraftTicket(t.id, user!.id);
                    refresh();
                  }}
                >
                  Submit draft
                </button>
              ) : null
            }
          />
        </div>
      </div>
    </>
  );
}
