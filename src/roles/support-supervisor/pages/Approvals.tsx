import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function Approvals() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const pending = useAppDb().tickets.filter((t) => t.status === 'resolved' && !t.supervisorApproved);
  return (
    <>
      <PageHeader title="Approve Closures" />
      <div className="card">
        <div className="card-body space-y-2">
          {pending.map((t) => (
            <div key={t.id} className="list-item">
              <span className="min-w-0 font-medium text-slate-200">
                <span className="font-mono text-candy-light">{t.ticketCode}</span>
                <span className="mt-1 block text-sm text-muted sm:mt-0 sm:inline"> — {t.subject}</span>
              </span>
              <button
                type="button"
                className="btn-success btn-sm w-full sm:w-auto"
                onClick={() => {
                  api.approveClosure(t.id, user!.id);
                  refresh();
                }}
              >
                Approve Close
              </button>
            </div>
          ))}
          {!pending.length && <p className="text-muted">No pending approvals.</p>}
        </div>
      </div>
    </>
  );
}
