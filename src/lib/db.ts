import type { AppDatabase } from '@/types';
import { notifyDbChanged } from './data-events';
import { migrateDb } from './migrateDb';
import { createSeedDatabase } from './seed';

export const STORAGE_KEY = 'helpdesk_db_v2';
export const DB_SCHEMA_VERSION = 3;

function isValidDb(data: unknown): data is AppDatabase {
  if (!data || typeof data !== 'object') return false;
  const d = data as AppDatabase;
  return Array.isArray(d.users) && Array.isArray(d.tickets) && d.nextIds != null && d.settings != null;
}

function shouldPersistMigration(before: AppDatabase, after: AppDatabase): boolean {
  if (!Array.isArray(before.knowledgeArticles) && Array.isArray(after.knowledgeArticles)) return true;
  if (!Array.isArray(before.kbCategories) && Array.isArray(after.kbCategories)) return true;
  if (!Array.isArray(before.systemRecords) || before.systemRecords.length === 0) {
    if ((after.systemRecords?.length ?? 0) > 0) return true;
  }
  if (before.nextIds?.systemRecords == null && after.nextIds?.systemRecords != null) return true;
  const beforeAtt = JSON.stringify(before.ticketAttachments ?? []);
  const afterAtt = JSON.stringify(after.ticketAttachments ?? []);
  if (beforeAtt !== afterAtt) return true;
  return false;
}

export function loadDb(): AppDatabase {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (isValidDb(parsed)) {
        const migrated = migrateDb(parsed);
        if (shouldPersistMigration(parsed, migrated)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          notifyDbChanged();
        }
        return migrated;
      }
    } catch {
      /* fall through */
    }
  }
  return migrateDb(reseedDb());
}

export function saveDb(db: AppDatabase): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  notifyDbChanged();
}

export function reseedDb(): AppDatabase {
  const seed = migrateDb(createSeedDatabase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  notifyDbChanged();
  return seed;
}

export function importDb(db: AppDatabase): void {
  if (!isValidDb(db)) throw new Error('Invalid database JSON');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrateDb(db)));
  notifyDbChanged();
}

const NEXT_ID_COLLECTIONS: Partial<Record<keyof AppDatabase['nextIds'], keyof AppDatabase>> = {
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

export function ensureNextIds(db: AppDatabase): void {
  if (!db.nextIds || typeof db.nextIds !== 'object') {
    db.nextIds = {};
  }
  for (const [key, collectionKey] of Object.entries(NEXT_ID_COLLECTIONS)) {
    const k = key as keyof AppDatabase['nextIds'];
    if (!collectionKey || (db.nextIds[k] != null && !Number.isNaN(db.nextIds[k]))) continue;
    const coll = db[collectionKey];
    const max = Array.isArray(coll) ? coll.reduce((m, row) => Math.max(m, (row as { id?: number }).id ?? 0), 0) : 0;
    db.nextIds[k] = max + 1;
  }
}

export function nextId(db: AppDatabase, key: keyof AppDatabase['nextIds']): number {
  ensureNextIds(db);
  if (db.nextIds[key] == null || Number.isNaN(db.nextIds[key])) {
    const collectionKey = NEXT_ID_COLLECTIONS[key];
    const coll = collectionKey ? db[collectionKey] : [];
    const max = Array.isArray(coll) ? coll.reduce((m, row) => Math.max(m, (row as { id?: number }).id ?? 0), 0) : 0;
    db.nextIds[key] = max + 1;
  }
  const id = db.nextIds[key]!;
  db.nextIds[key] = id + 1;
  return id;
}
