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

export function nextId(db: AppDatabase, key: keyof AppDatabase['nextIds']): number {
  const id = db.nextIds[key]++;
  return id;
}
