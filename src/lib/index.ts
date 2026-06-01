/**
 * Application data layer — all reads/writes go through db.ts persistence.
 * @see api.ts for mutations
 * @see db.ts for persistence
 */
export { api, enrichTicket } from './api';
export { loadDb, saveDb, reseedDb, importDb, STORAGE_KEY } from './db';
export { subscribeDbChange, notifyDbChanged } from './data-events';
