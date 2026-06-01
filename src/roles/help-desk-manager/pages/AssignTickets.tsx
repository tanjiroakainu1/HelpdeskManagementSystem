import { FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TicketTable } from '@/features/shared/TicketTable';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { useRefresh } from '@/hooks/useRefresh';

export default function AssignTickets() {
  const refresh = useRefresh();
  const { user } = useAuth();
  const db = useAppDb();
  const agents = db.users.filter((u) => ['support_agent', 'support_supervisor'].includes(u.role));

  return (
    <>
      <PageHeader title="Assign Tickets" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <TicketTable
            tickets={db.tickets.filter((t) => !['closed', 'resolved'].includes(t.status))}
            extraColumns={(t) => (
              <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  api.assignTicket(t.id, Number(fd.get('assign')), user!.id);
                  refresh();
                }}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <select name="assign" className="form-input w-full py-1 sm:w-40">
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.fullName}</option>
                  ))}
                </select>
                <button type="submit" className="btn-primary btn-sm w-full sm:w-auto">Assign</button>
              </form>
            )}
          />
        </div>
      </div>
    </>
  );
}
