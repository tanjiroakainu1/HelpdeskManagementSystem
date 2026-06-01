import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

import type { TicketStatus } from '@/types';

export function EscalationList({ title }: { title: string }) {
  const refresh = useRefresh();
  const { user } = useAuth();
  const esc = useAppDb().escalations;

  return (
    <>
      <PageHeader title={title} />
      <div className="card">
        <div className="card-body space-y-3">
          {!esc.length && (
            <EmptyState title="No escalations" description="Pending escalations will appear here." icon="⬆" />
          )}
          {esc.map((e) => {
            const t = api.getTicket(e.ticketId);
            return (
              <div key={e.id} className="list-item">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-candy-light">{t?.ticketCode}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">{e.reason}</p>
                  <div className="mt-2">
                    <StatusBadge status={e.status as TicketStatus} />
                  </div>
                </div>
                {e.status === 'pending' && (
                  <div className="escalation-actions toolbar">
                    <button
                      type="button"
                      className="btn-success btn-sm"
                      onClick={() => {
                        api.updateEscalation(e.id, 'approved', user!.id);
                        refresh();
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => {
                        api.updateEscalation(e.id, 'rejected', user!.id);
                        refresh();
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
