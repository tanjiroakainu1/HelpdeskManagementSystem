import { FormEvent, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTableWrap } from '@/components/ui/DataTableWrap';
import { AttachmentPreview } from '@/components/ui/AttachmentPreview';
import { FileUploadField } from '@/components/ui/FileUploadField';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { formatFileSize } from '@/lib/files';
import { useAuth } from '@/context/AuthContext';
import { useRefresh } from '@/hooks/useRefresh';
import { useAppDb } from '@/hooks/useAppDb';
import type { AttachmentPayload } from '@/types';

export default function UploadDocuments() {
  const { user } = useAuth();
  const refresh = useRefresh();
  const db = useAppDb();

  const uploads = useMemo(
    () =>
      db.ticketAttachments
        .filter((a) => api.getTicket(a.ticketId)?.requesterId === user?.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [db.ticketAttachments, user?.id],
  );

  const openTickets = db.tickets.filter((t) => t.requesterId === user?.id && t.status !== 'closed');
  const [ticketId, setTicketId] = useState(openTickets[0]?.id ?? 0);
  const [filePayload, setFilePayload] = useState<AttachmentPayload | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const editing = editingId != null ? uploads.find((u) => u.id === editingId) : undefined;

  const ticketOptions = useMemo(() => {
    const list = [...openTickets];
    if (editing) {
      const current = db.tickets.find((t) => t.id === editing.ticketId);
      if (current && !list.some((t) => t.id === current.id)) {
        list.unshift(current);
      }
    }
    return list;
  }, [openTickets, editing, db.tickets]);

  const resetForm = () => {
    setEditingId(null);
    setFilePayload(null);
    setFormError(null);
    setTicketId(openTickets[0]?.id ?? 0);
  };

  const startEdit = (id: number) => {
    const row = uploads.find((u) => u.id === id);
    if (!row) return;
    setEditingId(id);
    setTicketId(row.ticketId);
    setFilePayload({
      fileName: row.fileName,
      mimeType: row.mimeType,
      fileSize: row.fileSize,
      dataUrl: row.dataUrl,
    });
    setFormError(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!user) return;
    if (!ticketId) {
      setFormError('Select an open ticket to attach this file.');
      return;
    }
    if (!filePayload?.fileName) {
      setFormError('Choose a file using the picker above.');
      return;
    }

    if (editingId != null) {
      api.updateAttachment(
        editingId,
        {
          ticketId,
          fileName: filePayload.fileName,
          mimeType: filePayload.mimeType,
          fileSize: filePayload.fileSize,
          dataUrl: filePayload.dataUrl,
        },
        user.id,
      );
    } else {
      api.addAttachment(ticketId, filePayload, user.id);
    }
    resetForm();
    refresh();
  };

  const remove = (id: number) => {
    if (!user) return;
    if (!window.confirm('Delete this attachment?')) return;
    api.deleteAttachment(id, user.id);
    if (editingId === id) resetForm();
    refresh();
  };

  return (
    <>
      <PageHeader
        title="Upload Documents"
        description="Attach photos or files to your open tickets. Preview images before saving."
      />

      {openTickets.length === 0 && !editing ? (
        <div className="card mb-6">
          <div className="card-body">
            <EmptyState
              title="No open tickets"
              description="Submit a ticket first, then return here to upload documents."
              icon="🎫"
            />
          </div>
        </div>
      ) : (
        <form className="card mb-6" onSubmit={submit}>
          <div className="card-header">
            <h2>{editingId != null ? 'Edit attachment' : 'Add attachment'}</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="form-label" htmlFor="upload-ticket">
                Ticket
              </label>
              <select
                id="upload-ticket"
                className="form-input"
                value={ticketId}
                onChange={(e) => setTicketId(Number(e.target.value))}
              >
                {ticketOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.ticketCode} — {t.subject}
                  </option>
                ))}
              </select>
            </div>

            <FileUploadField
              label="Photo or document"
              value={filePayload}
              onChange={setFilePayload}
              required
              hint="Use Choose file — selected images appear in the preview box immediately."
            />

            {formError && <p className="alert-error">{formError}</p>}

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn-primary">
                {editingId != null ? 'Save changes' : 'Upload'}
              </button>
              {editingId != null && (
                <button type="button" className="btn-ghost" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Your uploads</h2>
          <p className="mt-1 text-xs text-muted">{uploads.length} file(s) across your tickets</p>
        </div>
        <div className="card-body card-body--flush-table">
          {uploads.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No uploads yet" description="Add a file using the form above." icon="📎" />
            </div>
          ) : (
            <DataTableWrap>
              <table className="data-table data-table--stack w-full text-sm">
                <thead>
                  <tr className="text-muted">
                    <th>Preview</th>
                    <th>Ticket</th>
                    <th>File</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((u) => {
                    const ticket = api.getTicket(u.ticketId);
                    return (
                      <tr key={u.id} className="border-t border-border">
                        <td data-label="Preview" className="p-2">
                          <AttachmentPreview
                            fileName={u.fileName}
                            mimeType={u.mimeType}
                            dataUrl={u.dataUrl}
                            size="sm"
                          />
                        </td>
                        <td data-label="Ticket" className="p-2 font-mono text-xs text-accent-soft">
                          {ticket?.ticketCode ?? '—'}
                        </td>
                        <td data-label="File" className="p-2 break-all">
                          {u.fileName}
                        </td>
                        <td data-label="Size" className="p-2 text-muted">
                          {formatFileSize(u.fileSize)}
                        </td>
                        <td data-label="Actions" className="p-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn-ghost btn-sm"
                              onClick={() => startEdit(u.id)}
                            >
                              Edit
                            </button>
                            <button type="button" className="btn-danger btn-sm" onClick={() => remove(u.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </DataTableWrap>
          )}
        </div>
      </div>

      {editing && (
        <p className="mt-2 text-xs text-muted">
          Editing <strong className="text-slate-300">{editing.fileName}</strong> — replace the file or change the
          ticket, then save.
        </p>
      )}
    </>
  );
}
