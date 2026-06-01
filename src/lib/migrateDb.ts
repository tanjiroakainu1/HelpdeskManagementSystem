import type { AppDatabase, AuditLog, CrudOperation, SystemRecord, UserRole } from '@/types';
import { DEMO_IMAGE_PLACEHOLDER, isImageFileName } from '@/lib/files';
import { ROLES } from '@/lib/roles';

function actionToOperation(action: string): CrudOperation {
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

export function migrateDb(db: AppDatabase): AppDatabase {
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

  return db;
}

export function roleLabel(role: UserRole | null): string {
  if (!role) return '—';
  return ROLES[role]?.label ?? role;
}
