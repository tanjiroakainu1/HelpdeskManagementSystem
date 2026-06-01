import { enrichTicket } from '@/lib/api';
import { roleLabel } from '@/lib/migrateDb';
import { ROLES } from '@/lib/roles';
import type { AppDatabase } from '@/types';

export type EntityRow = Record<string, string | number>;

export function getSharedEntityRows(
  db: AppDatabase,
  entityType: string,
  limit = 20,
): { columns: { key: string; label: string }[]; rows: EntityRow[] } {
  switch (entityType) {
    case 'ticket':
      return {
        columns: [
          { key: 'code', label: 'Code' },
          { key: 'subject', label: 'Subject' },
          { key: 'status', label: 'Status' },
          { key: 'requester', label: 'Requester' },
          { key: 'updated', label: 'Updated' },
        ],
        rows: [...db.tickets]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, limit)
          .map((t) => {
            const e = enrichTicket(t);
            return {
              id: t.id,
              code: t.ticketCode,
              subject: t.subject,
              status: t.status,
              requester: e.requesterName,
              updated: t.updatedAt.slice(0, 16),
            };
          }),
      };
    case 'attachment':
      return {
        columns: [
          { key: 'file', label: 'File' },
          { key: 'ticket', label: 'Ticket' },
          { key: 'by', label: 'Uploaded by' },
          { key: 'when', label: 'When' },
        ],
        rows: [...db.ticketAttachments]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)
          .map((a) => {
            const ticket = db.tickets.find((t) => t.id === a.ticketId);
            const uploader = db.users.find((u) => u.id === a.uploadedBy);
            return {
              id: a.id,
              file: a.fileName,
              ticket: ticket?.ticketCode ?? '—',
              by: uploader?.fullName ?? '—',
              when: a.createdAt.slice(0, 16),
            };
          }),
      };
    case 'message':
      return {
        columns: [
          { key: 'ticket', label: 'Ticket' },
          { key: 'user', label: 'User' },
          { key: 'preview', label: 'Message' },
          { key: 'when', label: 'When' },
        ],
        rows: [...db.ticketMessages]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)
          .map((m) => {
            const ticket = db.tickets.find((t) => t.id === m.ticketId);
            const u = db.users.find((x) => x.id === m.userId);
            return {
              id: m.id,
              ticket: ticket?.ticketCode ?? '—',
              user: u?.fullName ?? '—',
              preview: m.message.slice(0, 60) + (m.message.length > 60 ? '…' : ''),
              when: m.createdAt.slice(0, 16),
            };
          }),
      };
    case 'category':
      return {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
        ],
        rows: db.kbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
      };
    case 'department':
      return {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'description', label: 'Description' },
          { key: 'users', label: 'Users' },
        ],
        rows: db.departments.slice(0, limit).map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description || '—',
          users: db.users.filter((u) => u.departmentId === d.id).length,
        })),
      };
    case 'user':
      return {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ],
        rows: db.users.slice(0, limit).map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: ROLES[u.role].label,
          status: u.isActive ? 'Active' : 'Inactive',
        })),
      };
    case 'article':
      return {
        columns: [
          { key: 'title', label: 'Title' },
          { key: 'status', label: 'Status' },
          { key: 'author', label: 'Author' },
          { key: 'updated', label: 'Updated' },
        ],
        rows: [...db.knowledgeArticles]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, limit)
          .map((a) => {
            const author = db.users.find((u) => u.id === a.authorId);
            return {
              id: a.id,
              title: a.title,
              status: a.status,
              author: author?.fullName ?? '—',
              updated: a.updatedAt.slice(0, 16),
            };
          }),
      };
    case 'escalation':
      return {
        columns: [
          { key: 'ticket', label: 'Ticket' },
          { key: 'reason', label: 'Reason' },
          { key: 'status', label: 'Status' },
          { key: 'when', label: 'When' },
        ],
        rows: [...db.escalations]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)
          .map((e) => {
            const ticket = db.tickets.find((t) => t.id === e.ticketId);
            return {
              id: e.id,
              ticket: ticket?.ticketCode ?? '—',
              reason: e.reason.slice(0, 50),
              status: e.status,
              when: e.createdAt.slice(0, 16),
            };
          }),
      };
    case 'asset':
      return {
        columns: [
          { key: 'tag', label: 'Tag' },
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status' },
        ],
        rows: db.assets.slice(0, limit).map((a) => ({
          id: a.id,
          tag: a.assetTag,
          name: a.name,
          type: a.type,
          status: a.status,
        })),
      };
    case 'repair':
      return {
        columns: [
          { key: 'issue', label: 'Issue' },
          { key: 'status', label: 'Status' },
          { key: 'tech', label: 'Technician' },
          { key: 'when', label: 'When' },
        ],
        rows: [...db.repairLogs]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)
          .map((r) => {
            const tech = db.users.find((u) => u.id === r.technicianId);
            return {
              id: r.id,
              issue: r.issueDescription.slice(0, 40),
              status: r.status,
              tech: tech?.fullName ?? '—',
              when: r.createdAt.slice(0, 16),
            };
          }),
      };
    case 'feedback':
      return {
        columns: [
          { key: 'ticket', label: 'Ticket' },
          { key: 'rating', label: 'Rating' },
          { key: 'user', label: 'User' },
          { key: 'when', label: 'When' },
        ],
        rows: [...db.feedback]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)
          .map((f) => {
            const ticket = db.tickets.find((t) => t.id === f.ticketId);
            const u = db.users.find((x) => x.id === f.userId);
            return {
              id: f.id,
              ticket: ticket?.ticketCode ?? '—',
              rating: `${f.rating}/5`,
              user: u?.fullName ?? '—',
              when: f.createdAt.slice(0, 16),
            };
          }),
      };
    case 'settings':
      return {
        columns: [
          { key: 'key', label: 'Setting' },
          { key: 'value', label: 'Value' },
        ],
        rows: Object.entries(db.settings).map(([key, value]) => ({
          id: key,
          key,
          value: String(value),
        })),
      };
    case 'system':
      return {
        columns: [
          { key: 'when', label: 'When' },
          { key: 'user', label: 'User' },
          { key: 'role', label: 'Role' },
          { key: 'summary', label: 'Summary' },
        ],
        rows: db.systemRecords.slice(0, limit).map((r) => ({
          id: r.id,
          when: r.createdAt.slice(0, 16),
          user: r.userName,
          role: roleLabel(r.userRole),
          summary: r.summary.slice(0, 80),
        })),
      };
    default:
      return {
        columns: [
          { key: 'when', label: 'When' },
          { key: 'operation', label: 'Op' },
          { key: 'type', label: 'Type' },
          { key: 'summary', label: 'Summary' },
        ],
        rows: db.systemRecords
          .filter((r) => r.entityType === entityType)
          .slice(0, limit)
          .map((r) => ({
            id: r.id,
            when: r.createdAt.slice(0, 16),
            operation: r.operation,
            type: r.entityType,
            summary: r.summary.slice(0, 80),
          })),
      };
  }
}
