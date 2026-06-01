import type { AppDatabase, AuditLog, CrudOperation, SystemRecord, UserRole } from '@/types';
import { DEMO_IMAGE_PLACEHOLDER, isImageFileName } from '@/lib/files';
import { ROLES } from '@/lib/roles';

const NEXT_ID_COLLECTIONS: Partial<Record<string, keyof AppDatabase>> = {
  users: 'users',
  tickets: 'tickets',
  ticketMessages: 'ticketMessages',
  ticketAttachments: 'ticketAttachments',
  escalations: 'escalations',
  knowledgeArticles: 'knowledgeArticles',
  assets: 'assets',
  repairLogs: 'repairLogs',
  qaReviews: 'qaReviews',
  feedback: 'feedback',
  notifications: 'notifications',
  auditLogs: 'auditLogs',
  systemRecords: 'systemRecords',
  departments: 'departments',
  kbCategories: 'kbCategories',
};

function ensureNextIds(db: AppDatabase): void {
  if (!db.nextIds || typeof db.nextIds !== 'object') {
    db.nextIds = {};
  }
  for (const [key, collectionKey] of Object.entries(NEXT_ID_COLLECTIONS)) {
    if (!collectionKey || (db.nextIds[key] != null && !Number.isNaN(db.nextIds[key]))) continue;
    const coll = db[collectionKey];
    const max = Array.isArray(coll) ? coll.reduce((m, row) => Math.max(m, (row as { id?: number }).id ?? 0), 0) : 0;
    db.nextIds[key] = max + 1;
  }
}

function actionToOperation(action: string): CrudOperation {
  if (
    action.includes('create') ||
    action.includes('register') ||
    action.includes('draft') ||
    action === 'login' ||
    action.includes('login')
  ) {
    return 'create';
  }
  if (action.includes('delete') || action.includes('reject')) return 'delete';
  return 'update';
}

function auditToRecord(db: AppDatabase, log: AuditLog): SystemRecord {
  const user = log.userId ? db.users.find((u) => u.id === log.userId) : undefined;
  return {
    id: log.id,
    userId: log.userId,
    userName: user?.fullName ?? 'System',
    userRole: user?.role ?? null,
    operation: actionToOperation(log.action),
    entityType: log.entityType ?? 'system',
    entityId: log.entityId,
    summary: log.details ?? log.action,
    createdAt: log.createdAt,
  };
}

const DB_COLLECTIONS: (keyof AppDatabase)[] = [
  'users',
  'departments',
  'slaPolicies',
  'tickets',
  'ticketMessages',
  'ticketAttachments',
  'escalations',
  'kbCategories',
  'knowledgeArticles',
  'assets',
  'repairLogs',
  'qaReviews',
  'feedback',
  'notifications',
  'auditLogs',
  'systemRecords',
];

function ensureCollections(db: AppDatabase): boolean {
  let changed = false;
  for (const key of DB_COLLECTIONS) {
    const value = db[key];
    if (!Array.isArray(value)) {
      (db as unknown as Record<string, unknown>)[key] = [];
      changed = true;
    }
  }
  if (!db.settings || typeof db.settings !== 'object') {
    db.settings = {
      siteName: 'Helpdesk Management System',
      slaEnabled: '1',
      autoAssign: '0',
      maxUploadMb: '10',
    };
    changed = true;
  }
  return changed;
}

export function migrateDb(db: AppDatabase): AppDatabase {
  const collectionsFixed = ensureCollections(db);
  ensureNextIds(db);

  const needsRecords =
    !Array.isArray(db.systemRecords) ||
    (db.systemRecords.length === 0 && (db.auditLogs?.length ?? 0) > 0);

  if (needsRecords) {
    db.systemRecords = (db.auditLogs ?? []).map((log) => auditToRecord(db, log));
    db.nextIds.systemRecords = Math.max(db.systemRecords.length + 1, db.nextIds.auditLogs ?? 1);
  }
  if (!Array.isArray(db.systemRecords)) {
    db.systemRecords = [];
  }
  if (db.nextIds.systemRecords == null) {
    db.nextIds.systemRecords = db.systemRecords.length + 1;
  }
  if (!Array.isArray(db.auditLogs)) db.auditLogs = [];
  if (!db.nextIds) db.nextIds = { users: 1, tickets: 1, systemRecords: 1, auditLogs: 1 };

  if (Array.isArray(db.ticketAttachments)) {
    for (const a of db.ticketAttachments) {
      if (!a.dataUrl && isImageFileName(a.fileName)) {
        a.dataUrl = DEMO_IMAGE_PLACEHOLDER;
        a.mimeType = a.mimeType ?? (a.fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
      }
    }
  }

  if (collectionsFixed) {
    db.nextIds = db.nextIds ?? {};
  }

  return db;
}

export function roleLabel(role: UserRole | null): string {
  if (!role) return '—';
  return ROLES[role]?.label ?? role;
}
