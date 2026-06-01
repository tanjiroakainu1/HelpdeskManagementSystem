import type {
  AppDatabase,
  AuditLog,
  Escalation,
  Feedback,
  KnowledgeArticle,
  Notification,
  QaReview,
  RepairLog,
  Ticket,
  TicketMessage,
  AttachmentPayload,
  TicketAttachment,
  TicketPriority,
  TicketStatus,
  User,
  UserRole,
} from '@/types';
import { isoNow } from './dates';
import { importDb, loadDb, nextId, reseedDb, saveDb } from './db';

function mutate(fn: (db: AppDatabase) => void): AppDatabase {
  const db = loadDb();
  fn(db);
  saveDb(db);
  return db;
}

export const api = {
  getDb: loadDb,

  /** Reset localStorage to full demo seed (same as PHP reseed). */
  reseed(): AppDatabase {
    return reseedDb();
  },

  /** Import a full database export (backup JSON). */
  restoreFromJson(json: string): void {
    const parsed = JSON.parse(json) as AppDatabase;
    importDb(parsed);
  },

  getUserByEmail(email: string): User | undefined {
    return loadDb().users.find((u) => u.email === email && u.isActive);
  },

  getUser(id: number): User | undefined {
    return loadDb().users.find((u) => u.id === id);
  },

  getUsers(): User[] {
    return loadDb().users;
  },

  updateUserRole(userId: number, role: UserRole): void {
    mutate((db) => {
      const u = db.users.find((x) => x.id === userId);
      if (u) u.role = role;
      audit(db, null, 'role_change', 'user', userId, `Role set to ${role}`);
    });
  },

  getDepartments() {
    return loadDb().departments;
  },

  addDepartment(name: string, description: string, actorId?: number): void {
    mutate((db) => {
      const id = nextId(db, 'departments');
      db.departments.push({ id, name, description });
      audit(db, actorId ?? null, 'department_create', 'department', id, name);
    });
  },

  updateDepartment(id: number, patch: { name?: string; description?: string }, actorId?: number): void {
    mutate((db) => {
      const dept = db.departments.find((d) => d.id === id);
      if (!dept) return;
      if (patch.name != null) dept.name = patch.name;
      if (patch.description != null) dept.description = patch.description;
      audit(db, actorId ?? null, 'department_update', 'department', id, dept.name);
    });
  },

  deleteDepartment(id: number, actorId?: number): void {
    mutate((db) => {
      const dept = db.departments.find((d) => d.id === id);
      db.departments = db.departments.filter((d) => d.id !== id);
      audit(db, actorId ?? null, 'department_delete', 'department', id, dept?.name ?? 'Removed');
    });
  },

  updateUser(
    userId: number,
    patch: Partial<Pick<User, 'fullName' | 'isActive' | 'departmentId' | 'role'>>,
    actorId?: number,
  ): void {
    mutate((db) => {
      const u = db.users.find((x) => x.id === userId);
      if (!u) return;
      if (patch.fullName != null) u.fullName = patch.fullName;
      if (patch.isActive != null) u.isActive = patch.isActive;
      if (patch.departmentId !== undefined) u.departmentId = patch.departmentId;
      if (patch.role != null) u.role = patch.role;
      audit(db, actorId ?? userId, 'user_update', 'user', userId, u.fullName);
    });
  },

  getSlaPolicies() {
    return loadDb().slaPolicies;
  },

  updateSlaPolicy(
    id: number,
    patch: Partial<Pick<import('@/types').SlaPolicy, 'name' | 'resolveHours' | 'isActive'>>,
    actorId?: number,
  ): void {
    mutate((db) => {
      const p = db.slaPolicies.find((x) => x.id === id);
      if (!p) return;
      if (patch.name != null) p.name = patch.name;
      if (patch.resolveHours != null) p.resolveHours = patch.resolveHours;
      if (patch.isActive != null) p.isActive = patch.isActive;
      audit(db, actorId ?? null, 'sla_update', 'settings', id, `${p.name}: ${p.resolveHours}h`);
    });
  },

  getKbCategories() {
    return loadDb().kbCategories;
  },

  addKbCategory(name: string, actorId?: number): void {
    mutate((db) => {
      const id = nextId(db, 'kbCategories');
      const slug =
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `category-${id}`;
      db.kbCategories.push({ id, name, slug });
      audit(db, actorId ?? null, 'category_create', 'category', id, name);
    });
  },

  updateKbCategory(id: number, name: string, actorId?: number): void {
    mutate((db) => {
      const c = db.kbCategories.find((x) => x.id === id);
      if (!c) return;
      c.name = name;
      c.slug =
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || c.slug;
      audit(db, actorId ?? null, 'category_update', 'category', id, name);
    });
  },

  deleteKbCategory(id: number, actorId?: number): void {
    mutate((db) => {
      const c = db.kbCategories.find((x) => x.id === id);
      db.kbCategories = db.kbCategories.filter((x) => x.id !== id);
      audit(db, actorId ?? null, 'category_delete', 'category', id, c?.name ?? 'Removed');
    });
  },

  getTickets(): Ticket[] {
    return loadDb().tickets;
  },

  getTicket(id: number): Ticket | undefined {
    return loadDb().tickets.find((t) => t.id === id);
  },

  ticketStats() {
    const t = loadDb().tickets;
    const open = t.filter((x) => !['closed', 'resolved'].includes(x.status)).length;
    const now = Date.now();
    return {
      total: t.length,
      open,
      escalated: t.filter((x) => x.status === 'escalated').length,
      resolved: t.filter((x) => ['resolved', 'closed'].includes(x.status)).length,
      slaBreach: t.filter(
        (x) => x.slaDueAt && new Date(x.slaDueAt).getTime() < now && !['resolved', 'closed'].includes(x.status)
      ).length,
    };
  },

  createTicket(data: {
    subject: string;
    description: string;
    category: string;
    priority: TicketPriority;
    requesterId: number;
    departmentId: number | null;
  }): Ticket {
    let created!: Ticket;
    mutate((db) => {
      const id = nextId(db, 'tickets');
      const sla = db.slaPolicies.find((s) => s.priority === data.priority && s.isActive);
      const code = `HD-${String(id).padStart(4, '0')}`;
      const hours = sla?.resolveHours ?? 24;
      created = {
        id,
        ticketCode: code,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: 'open',
        requesterId: data.requesterId,
        assignedTo: null,
        departmentId: data.departmentId,
        slaPolicyId: sla?.id ?? null,
        slaDueAt: new Date(Date.now() + hours * 3600000).toISOString(),
        deptApproved: false,
        supervisorApproved: false,
        qaReviewed: false,
        createdAt: isoNow(),
        updatedAt: isoNow(),
        closedAt: null,
      };
      db.tickets.push(created);
      audit(db, data.requesterId, 'ticket_create', 'ticket', id, code);
      notifyRole(db, 'help_desk_manager', 'New Ticket', code, `/help-desk-manager/assign-tickets`);
      if (data.departmentId) {
        db.users
          .filter((u) => u.role === 'department_head' && u.departmentId === data.departmentId)
          .forEach((h) => notify(db, h.id, 'Dept Approval Needed', code, `/department-head/approvals`));
      }
    });
    return created;
  },

  assignTicket(ticketId: number, assignTo: number, actorId: number): void {
    mutate((db) => {
      const t = db.tickets.find((x) => x.id === ticketId);
      if (!t) return;
      t.assignedTo = assignTo || null;
      t.status = assignTo ? 'assigned' : t.status;
      t.updatedAt = isoNow();
      notify(db, assignTo, 'Ticket Assigned', t.ticketCode, `/support-agent/my-tickets`);
      audit(db, actorId, 'ticket_assign', 'ticket', ticketId);
    });
  },

  updateTicketStatus(ticketId: number, status: TicketStatus, actorId: number): void {
    mutate((db) => {
      const t = db.tickets.find((x) => x.id === ticketId);
      if (!t) return;
      t.status = status;
      t.updatedAt = isoNow();
      if (['resolved', 'closed'].includes(status)) t.closedAt = isoNow();
      audit(db, actorId, 'agent_status', 'ticket', ticketId, status);
    });
  },

  resolveTicket(ticketId: number, actorId: number): void {
    mutate((db) => {
      const t = db.tickets.find((x) => x.id === ticketId);
      if (!t) return;
      t.status = 'resolved';
      t.updatedAt = isoNow();
      notify(db, t.requesterId, 'Ticket Resolved', t.ticketCode, `/employee-customer/ticket-view?id=${ticketId}`);
      db.users.filter((u) => u.role === 'support_supervisor').forEach((s) =>
        notify(db, s.id, 'Approve Closure', t.ticketCode, `/support-supervisor/approvals`)
      );
      audit(db, actorId, 'agent_resolve', 'ticket', ticketId);
    });
  },

  approveClosure(ticketId: number, actorId: number): void {
    mutate((db) => {
      const t = db.tickets.find((x) => x.id === ticketId);
      if (!t) return;
      t.supervisorApproved = true;
      t.status = 'closed';
      t.closedAt = isoNow();
      t.updatedAt = isoNow();
      notify(db, t.requesterId, 'Ticket Closed', t.ticketCode, `/employee-customer/ticket-view?id=${ticketId}`);
      db.users.filter((u) => u.role === 'qa_officer').forEach((q) =>
        notify(db, q.id, 'QA Review', t.ticketCode, `/quality-assurance-officer/reviews`)
      );
      audit(db, actorId, 'closure_approve', 'ticket', ticketId);
    });
  },

  deptApprove(ticketId: number, approve: boolean, actorId: number): void {
    mutate((db) => {
      const t = db.tickets.find((x) => x.id === ticketId);
      if (!t) return;
      t.deptApproved = approve;
      t.updatedAt = isoNow();
      if (approve) notifyRole(db, 'help_desk_manager', 'Dept Approved', t.ticketCode, `/help-desk-manager/assign-tickets`);
      audit(db, actorId, approve ? 'dept_approve' : 'dept_reject', 'ticket', ticketId);
    });
  },

  addMessage(ticketId: number, userId: number, message: string, isInternal: boolean): void {
    mutate((db) => {
      const id = nextId(db, 'ticketMessages');
      db.ticketMessages.push({ id, ticketId, userId, message, isInternal, createdAt: isoNow() });
      const t = db.tickets.find((x) => x.id === ticketId);
      if (t) {
        t.updatedAt = isoNow();
        audit(db, userId, isInternal ? 'message_internal' : 'message_create', 'message', id, `${t.ticketCode}: ${message.slice(0, 60)}`);
        if (!isInternal && t.assignedTo && t.assignedTo !== userId) {
          notify(db, t.assignedTo, 'New Reply', t.ticketCode, `/support-agent/respond-inquiries`);
        }
        if (!isInternal && t.requesterId !== userId) {
          notify(db, t.requesterId, 'Support Reply', t.ticketCode, `/employee-customer/ticket-messages`);
        }
      }
    });
  },

  getMessages(ticketId: number, includeInternal = false): TicketMessage[] {
    return loadDb().ticketMessages.filter(
      (m) => m.ticketId === ticketId && (includeInternal || !m.isInternal)
    );
  },

  getAttachments(ticketId: number) {
    return loadDb().ticketAttachments.filter((a) => a.ticketId === ticketId);
  },

  getAttachment(id: number): TicketAttachment | undefined {
    return loadDb().ticketAttachments.find((a) => a.id === id);
  },

  addAttachment(ticketId: number, payload: AttachmentPayload, userId: number): void {
    mutate((db) => {
      const id = nextId(db, 'ticketAttachments');
      db.ticketAttachments.push({
        id,
        ticketId,
        fileName: payload.fileName,
        uploadedBy: userId,
        createdAt: isoNow(),
        mimeType: payload.mimeType,
        fileSize: payload.fileSize,
        dataUrl: payload.dataUrl,
      });
      const t = db.tickets.find((x) => x.id === ticketId);
      audit(db, userId, 'attachment_create', 'attachment', id, `${t?.ticketCode ?? 'Ticket'}: ${payload.fileName}`);
    });
  },

  updateAttachment(id: number, patch: Partial<AttachmentPayload> & { ticketId?: number }, userId: number): void {
    mutate((db) => {
      const a = db.ticketAttachments.find((x) => x.id === id);
      if (!a) return;
      if (patch.ticketId != null) a.ticketId = patch.ticketId;
      if (patch.fileName != null) a.fileName = patch.fileName;
      if (patch.mimeType !== undefined) a.mimeType = patch.mimeType;
      if (patch.fileSize !== undefined) a.fileSize = patch.fileSize;
      if (patch.dataUrl !== undefined) a.dataUrl = patch.dataUrl;
      const t = db.tickets.find((x) => x.id === a.ticketId);
      audit(db, userId, 'attachment_update', 'attachment', id, `${t?.ticketCode ?? 'Ticket'}: ${a.fileName}`);
    });
  },

  deleteAttachment(id: number, userId: number): void {
    mutate((db) => {
      const idx = db.ticketAttachments.findIndex((x) => x.id === id);
      if (idx < 0) return;
      const a = db.ticketAttachments[idx];
      const t = db.tickets.find((x) => x.id === a.ticketId);
      db.ticketAttachments.splice(idx, 1);
      audit(db, userId, 'attachment_delete', 'attachment', id, `${t?.ticketCode ?? 'Ticket'}: ${a.fileName}`);
    });
  },

  getEscalations() {
    return loadDb().escalations;
  },

  updateEscalation(id: number, status: Escalation['status'], actorId: number): void {
    mutate((db) => {
      const e = db.escalations.find((x) => x.id === id);
      if (!e) return;
      e.status = status;
      if (status === 'approved') {
        const t = db.tickets.find((x) => x.id === e.ticketId);
        if (t) t.status = 'escalated';
      }
      audit(db, actorId, `escalation_${status}`, 'escalation', id);
    });
  },

  createEscalation(ticketId: number, raisedBy: number, targetRole: string, reason: string): void {
    mutate((db) => {
      const id = nextId(db, 'escalations');
      db.escalations.push({
        id,
        ticketId,
        raisedBy,
        targetRole,
        reason,
        status: 'pending',
        createdAt: isoNow(),
      });
      const t = db.tickets.find((x) => x.id === ticketId);
      audit(db, raisedBy, 'escalation_create', 'escalation', id, `${t?.ticketCode ?? ''}: ${reason.slice(0, 80)}`);
      if (t && targetRole === 'help_desk_manager') {
        t.status = 'escalated';
        notifyRole(db, 'help_desk_manager', 'Escalation', reason, `/help-desk-manager/escalations`);
      }
      if (targetRole === 'it_technician') {
        notifyRole(db, 'it_technician', 'Tech Escalation', t?.ticketCode ?? '', `/it-technician/technical-tickets`);
      }
    });
  },

  getAssets() {
    return loadDb().assets;
  },

  addAsset(data: Omit<import('@/types').Asset, 'id'>, actorId?: number): void {
    mutate((db) => {
      const id = nextId(db, 'assets');
      db.assets.push({ ...data, id });
      audit(db, actorId ?? null, 'asset_create', 'asset', id, `${data.assetTag} — ${data.name}`);
    });
  },

  updateAsset(
    id: number,
    patch: Partial<Pick<import('@/types').Asset, 'name' | 'status' | 'type' | 'notes' | 'assignedUserId'>>,
    actorId?: number,
  ): void {
    mutate((db) => {
      const a = db.assets.find((x) => x.id === id);
      if (!a) return;
      Object.assign(a, patch);
      audit(db, actorId ?? null, 'asset_update', 'asset', id, `${a.assetTag} — ${a.name}`);
    });
  },

  deleteAsset(id: number, actorId?: number): void {
    mutate((db) => {
      const a = db.assets.find((x) => x.id === id);
      db.assets = db.assets.filter((x) => x.id !== id);
      audit(db, actorId ?? null, 'asset_delete', 'asset', id, a?.assetTag ?? 'Removed');
    });
  },

  getRepairLogs() {
    return loadDb().repairLogs;
  },

  addRepairLog(
    data: Omit<RepairLog, 'id' | 'createdAt' | 'completedAt'> & { createdAt?: string },
  ): void {
    mutate((db) => {
      const rid = nextId(db, 'repairLogs');
      db.repairLogs.push({
        ...data,
        id: rid,
        createdAt: isoNow(),
        completedAt: null,
      } as RepairLog);
      audit(db, data.technicianId, 'repair_create', 'repair', rid, data.issueDescription.slice(0, 80));
    });
  },

  completeRepair(id: number, resolution: string, actorId?: number): void {
    mutate((db) => {
      const r = db.repairLogs.find((x) => x.id === id);
      if (r) {
        r.status = 'completed';
        r.resolution = resolution;
        r.completedAt = isoNow();
        audit(db, actorId ?? r.technicianId, 'repair_complete', 'repair', id, resolution.slice(0, 80));
      }
    });
  },

  getArticles() {
    return loadDb().knowledgeArticles;
  },

  addArticle(data: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'views'>): void {
    mutate((db) => {
      const now = isoNow();
      const id = nextId(db, 'knowledgeArticles');
      db.knowledgeArticles.push({
        ...data,
        id,
        views: 0,
        createdAt: now,
        updatedAt: now,
      });
      audit(db, data.authorId, 'article_create', 'article', id, data.title);
    });
  },

  updateArticle(id: number, patch: Partial<KnowledgeArticle>, actorId?: number): void {
    mutate((db) => {
      const a = db.knowledgeArticles.find((x) => x.id === id);
      if (a) {
        Object.assign(a, patch, { updatedAt: isoNow() });
        const uid = actorId ?? a.authorId;
        audit(db, uid, 'article_update', 'article', id, patch.title ?? a.title);
      }
    });
  },

  deleteArticle(id: number, actorId?: number): void {
    mutate((db) => {
      const a = db.knowledgeArticles.find((x) => x.id === id);
      db.knowledgeArticles = db.knowledgeArticles.filter((x) => x.id !== id);
      audit(db, actorId ?? a?.authorId ?? null, 'article_delete', 'article', id, a?.title ?? 'Removed');
    });
  },

  addQaReview(data: Omit<QaReview, 'id' | 'createdAt'>): void {
    mutate((db) => {
      db.qaReviews.push({ ...data, id: nextId(db, 'qaReviews'), createdAt: isoNow() });
      const t = db.tickets.find((x) => x.id === data.ticketId);
      if (t) t.qaReviewed = true;
      audit(db, data.reviewerId, 'qa_review', 'ticket', data.ticketId);
    });
  },

  addFeedback(data: Omit<Feedback, 'id' | 'createdAt'>): void {
    mutate((db) => {
      db.feedback.push({ ...data, id: nextId(db, 'feedback'), createdAt: isoNow() });
      audit(db, data.userId, 'feedback_create', 'feedback', data.ticketId, `Rating ${data.rating}/5`);
    });
  },

  getFeedback() {
    return loadDb().feedback;
  },

  getQaReviews() {
    return loadDb().qaReviews;
  },

  getAuditLogs() {
    return loadDb().auditLogs;
  },

  getSystemRecords() {
    return loadDb().systemRecords;
  },

  getSystemRecordsByEntity(entityType: string, limit = 50) {
    return loadDb().systemRecords.filter((r) => r.entityType === entityType).slice(0, limit);
  },

  addQaRecommendation(userId: number, text: string): void {
    mutate((db) => audit(db, userId, 'qa_recommendation', 'system', null, text));
  },

  getNotifications(userId: number) {
    return loadDb().notifications.filter((n) => n.userId === userId);
  },

  unreadCount(userId: number) {
    return loadDb().notifications.filter((n) => n.userId === userId && !n.isRead).length;
  },

  markNotificationRead(id: number): void {
    mutate((db) => {
      const n = db.notifications.find((x) => x.id === id);
      if (n) n.isRead = true;
    });
  },

  markAllNotificationsRead(userId: number): void {
    mutate((db) => {
      db.notifications.filter((n) => n.userId === userId && !n.isRead).forEach((n) => {
        n.isRead = true;
      });
    });
  },

  updateSettings(patch: Partial<import('@/types').SystemSettings>, actorId?: number): void {
    mutate((db) => {
      db.settings = { ...db.settings, ...patch };
      audit(db, actorId ?? null, 'settings_update', 'settings', null, Object.keys(patch).join(', '));
    });
  },

  registerUser(data: { fullName: string; email: string; password: string; departmentId: number | null }): User {
    let user!: User;
    mutate((db) => {
      const id = nextId(db, 'users');
      user = {
        id,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: 'employee',
        departmentId: data.departmentId,
        isActive: true,
        createdAt: isoNow(),
      };
      db.users.push(user);
      audit(db, id, 'user_register', 'user', id, data.email);
      notify(db, 1, 'New Registration', data.fullName, `/super-admin/users`);
    });
    return user;
  },

  auditLogin(userId: number, action: string): void {
    mutate((db) => audit(db, userId, action, 'user', userId, action));
  },
};

function actionToOperation(action: string): import('@/types').CrudOperation {
  if (
    action.includes('create') ||
    action.includes('register') ||
    action === 'login' ||
    action.includes('login')
  ) {
    return 'create';
  }
  if (action.includes('delete') || action.includes('reject')) return 'delete';
  return 'update';
}

function logSystemRecord(
  db: AppDatabase,
  userId: number | null,
  operation: import('@/types').CrudOperation,
  entityType: string,
  entityId: number | null,
  summary: string,
): void {
  const user = userId ? db.users.find((u) => u.id === userId) : undefined;
  db.systemRecords.unshift({
    id: nextId(db, 'systemRecords'),
    userId,
    userName: user?.fullName ?? 'System',
    userRole: user?.role ?? null,
    operation,
    entityType,
    entityId,
    summary,
    createdAt: isoNow(),
  });
  if (db.systemRecords.length > 500) db.systemRecords.length = 500;
}

function audit(
  db: AppDatabase,
  userId: number | null,
  action: string,
  entityType: string | null,
  entityId: number | null,
  details?: string
): void {
  const summary = details ?? action;
  const type = entityType ?? 'system';
  db.auditLogs.unshift({
    id: nextId(db, 'auditLogs'),
    userId,
    action,
    entityType,
    entityId,
    details: summary,
    ipAddress: '127.0.0.1',
    createdAt: isoNow(),
  });
  if (db.auditLogs.length > 500) db.auditLogs.length = 500;
  logSystemRecord(db, userId, actionToOperation(action), type, entityId, summary);
}

function notify(db: AppDatabase, userId: number, title: string, message: string, link: string): void {
  db.notifications.unshift({
    id: nextId(db, 'notifications'),
    userId,
    title,
    message,
    link,
    isRead: false,
    createdAt: isoNow(),
  });
}

function notifyRole(db: AppDatabase, role: UserRole, title: string, message: string, link: string): void {
  db.users.filter((u) => u.role === role).forEach((u) => notify(db, u.id, title, message, link));
}

export function enrichTicket(ticket: Ticket) {
  const db = loadDb();
  const requester = db.users.find((u) => u.id === ticket.requesterId);
  const assignee = ticket.assignedTo ? db.users.find((u) => u.id === ticket.assignedTo) : null;
  const department = ticket.departmentId ? db.departments.find((d) => d.id === ticket.departmentId) : null;
  return {
    ...ticket,
    requesterName: requester?.fullName ?? '—',
    assigneeName: assignee?.fullName ?? 'Unassigned',
    departmentName: department?.name ?? '—',
  };
}
