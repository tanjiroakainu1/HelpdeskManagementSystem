import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';

export default function Approvals() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const pending = useAppDb().tickets.filter((t) => t.departmentId === user?.departmentId && !t.deptApproved);
  return (
    <>
      <PageHeader title="Approve Requests" />
      <div className="card">
        <div className="card-body space-y-2">
          {pending.map((t) => (
            <div key={t.id} className="flex flex-col gap-3 border-b border-border py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="min-w-0 text-sm sm:text-base">{t.ticketCode} — {t.subject}</span>
              <div className="toolbar shrink-0 sm:flex-row">
                <button type="button" className="btn-success btn-sm" onClick={() => { api.deptApprove(t.id, true, user!.id); refresh(); }}>Approve</button>
                <button type="button" className="btn-danger btn-sm" onClick={() => { api.deptApprove(t.id, false, user!.id); refresh(); }}>Reject</button>
              </div>
            </div>
          ))}
          {!pending.length && <p className="text-muted">No pending approvals.</p>}
        </div>
      </div>
    </>
  );
}
