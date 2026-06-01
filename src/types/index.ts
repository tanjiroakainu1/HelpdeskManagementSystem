export type UserRole =
  | 'super_admin'
  | 'help_desk_manager'
  | 'support_supervisor'
  | 'support_agent'
  | 'it_technician'
  | 'department_head'
  | 'employee'
  | 'knowledge_base_editor'
  | 'qa_officer'
  | 'system_auditor';

export type TicketStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'pending_approval'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface SlaPolicy {
  id: number;
  name: string;
  priority: TicketPriority;
  responseHours: number;
  resolveHours: number;
  isActive: boolean;
}

export interface Ticket {
  id: number;
  ticketCode: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterId: number;
  assignedTo: number | null;
  departmentId: number | null;
  slaPolicyId: number | null;
  slaDueAt: string | null;
  deptApproved: boolean;
  supervisorApproved: boolean;
  qaReviewed: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  userId: number;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketAttachment {
  id: number;
  ticketId: number;
  fileName: string;
  uploadedBy: number;
  createdAt: string;
  /** MIME type from the browser when uploaded */
  mimeType?: string;
  fileSize?: number;
  /** Base64 data URL for image preview (stored in local demo DB) */
  dataUrl?: string;
}

export interface AttachmentPayload {
  fileName: string;
  mimeType?: string;
  fileSize?: number;
  dataUrl?: string;
}

export interface Escalation {
  id: number;
  ticketId: number;
  raisedBy: number;
  targetRole: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  createdAt: string;
}

export interface KbCategory {
  id: number;
  name: string;
  slug: string;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  status: 'draft' | 'published' | 'archived';
  authorId: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: number;
  assetTag: string;
  name: string;
  type: 'hardware' | 'software' | 'network' | 'peripheral';
  status: 'active' | 'repair' | 'retired';
  departmentId: number | null;
  assignedUserId: number | null;
  notes: string;
}

export interface RepairLog {
  id: number;
  assetId: number | null;
  ticketId: number | null;
  technicianId: number;
  issueDescription: string;
  resolution: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'escalated';
  createdAt: string;
  completedAt: string | null;
}

export interface QaReview {
  id: number;
  ticketId: number;
  reviewerId: number;
  qualityScore: number;
  notes: string;
  recommendation: string;
  createdAt: string;
}

export interface Feedback {
  id: number;
  ticketId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

/** Unified CRUD log — visible to every role via System Records */
export type CrudOperation = 'create' | 'update' | 'delete';

export interface SystemRecord {
  id: number;
  userId: number | null;
  userName: string;
  userRole: UserRole | null;
  operation: CrudOperation;
  entityType: string;
  entityId: number | null;
  summary: string;
  createdAt: string;
}

export interface SystemSettings {
  siteName: string;
  slaEnabled: string;
  autoAssign: string;
  maxUploadMb: string;
}

export interface AppDatabase {
  users: User[];
  departments: Department[];
  slaPolicies: SlaPolicy[];
  tickets: Ticket[];
  ticketMessages: TicketMessage[];
  ticketAttachments: TicketAttachment[];
  escalations: Escalation[];
  kbCategories: KbCategory[];
  knowledgeArticles: KnowledgeArticle[];
  assets: Asset[];
  repairLogs: RepairLog[];
  qaReviews: QaReview[];
  feedback: Feedback[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  systemRecords: SystemRecord[];
  settings: SystemSettings;
  nextIds: Record<string, number>;
}

export interface RoleMenuItem {
  label: string;
  slug: string;
}

export interface RoleConfig {
  key: UserRole;
  label: string;
  folder: string;
  menus: RoleMenuItem[];
}
