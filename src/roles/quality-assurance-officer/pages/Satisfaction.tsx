import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { api } from '@/lib/api';
import { useAppDb } from '@/hooks/useAppDb';

export default function Satisfaction() {
  const feedback = useAppDb().feedback;
  return (
    <>
      <PageHeader title="Customer Satisfaction" />
      <div className="card">
        <div className="card-body card-body--flush-table">
          <DataTableWrap>
            <table className="data-table data-table--stack w-full text-sm">
              <thead>
                <tr className="text-muted">
                  <th>Ticket</th>
                  <th>Rating</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((f) => {
                  const t = api.getTicket(f.ticketId);
                  return (
                    <tr key={f.id} className="border-t border-border">
                      <td data-label="Ticket" className="p-2">{t?.ticketCode}</td>
                      <td data-label="Rating" className="p-2">{f.rating}/5</td>
                      <td data-label="Comment" className="p-2">{f.comment}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DataTableWrap>
        </div>
      </div>
    </>
  );
}
